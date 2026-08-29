import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class AssessmentAttemptService {
  async startAttempt(userId: string, assessmentId: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    const assessment = await prisma.assessment.findUniqueOrThrow({
      where: { id: assessmentId },
      include: { questions: { include: { question: { include: { choices: true } } } } },
    });

    // Check open attempt limits
    const existingAttemptsCount = await prisma.assessmentAttempt.count({
      where: { studentId: student.id, assessmentId },
    });

    const seed = Math.random().toString(36).substring(2, 10);
    const attemptId = generateUuidV7();

    // 1. Create Attempt record
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        id: attemptId,
        studentId: student.id,
        assessmentId,
        attemptNum: existingAttemptsCount + 1,
        status: 'IN_PROGRESS',
      },
    });

    // 2. Create Attempt Snapshot
    const questionIds = assessment.questions.map((q) => q.questionId);
    await prisma.assessmentAttemptSnapshot.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        assessmentVersionId: assessment.id,
        questionOrder: questionIds,
        optionOrder: {},
        randomizationSeed: seed,
      },
    });

    // 3. Create Question Snapshots
    for (const aq of assessment.questions) {
      await prisma.questionSnapshot.create({
        data: {
          id: generateUuidV7(),
          attemptId,
          questionId: aq.questionId,
          contentJson: { text: aq.question.text },
          optionsJson: aq.question.choices.map((c) => ({ id: c.id, text: c.text })),
          correctAnswer: aq.question.choices.filter((c) => c.isCorrect).map((c) => c.text),
          scoringRules: { pointsWeight: aq.pointsWeight },
        },
      });
    }

    return attempt;
  }

  async autoSaveAnswer(attemptId: string, questionId: string, answer: any) {
    await prisma.questionAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      update: {
        textResponse: typeof answer === 'string' ? answer : JSON.stringify(answer),
        isGraded: false,
      },
      create: {
        id: generateUuidV7(),
        attemptId,
        questionId,
        textResponse: typeof answer === 'string' ? answer : JSON.stringify(answer),
        isGraded: false,
      },
    });

    return { success: true };
  }
}
