import { Injectable, BadRequestException } from '@nestjs/common';
import { QuizRepository, prisma } from '@eduverse/database';
import { QuizPassedEvent, QuizFailedEvent, DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { QuizAttemptDto } from '../../dto/quiz.dto';

@Injectable()
export class SubmitQuizAttemptHandler {
  constructor(private readonly quizRepository: QuizRepository) {}

  async execute(quizId: string, dto: QuizAttemptDto) {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new BadRequestException('Quiz not found');
    }

    const mapping = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: quizId },
      include: {
        question: {
          include: { choices: true },
        },
      },
    });

    let correctCount = 0;
    const totalQuestions = mapping.length;

    for (const item of mapping) {
      const qId = item.questionId;
      const studentChoices = dto.answers[qId] || [];
      const correctChoices = item.question.choices.filter((c: any) => c.isCorrect).map((c: any) => c.id);

      // Check if matches correctly
      const isCorrect =
        correctChoices.length === studentChoices.length &&
        correctChoices.every((id: any) => studentChoices.includes(id));

      if (isCorrect) correctCount++;
    }

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 100;
    const passed = score >= quiz.passingScore;
    const attemptId = generateUuidV7();

    // Save attempt record in assessmentAttempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        id: attemptId,
        studentId: dto.studentId,
        assessmentId: quizId,
        attemptNum: 1,
        status: 'SUBMITTED',
        startedAt: new Date(),
        submittedAt: new Date(),
        savedAnswers: dto.answers as any,
      },
    });

    // Save result record
    await prisma.assessmentResult.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        score,
        percentage: score,
        grade: score >= 70 ? 'C' : 'F',
        passed,
        publishedAt: new Date(),
      },
    });

    // Dispatch event
    if (passed) {
      await DomainEventBus.getInstance().publish(
        new QuizPassedEvent(dto.studentId, quizId, attemptId, score)
      );
    } else {
      await DomainEventBus.getInstance().publish(
        new QuizFailedEvent(dto.studentId, quizId, attemptId, score)
      );
    }

    return {
      id: attempt.id,
      studentId: attempt.studentId,
      quizId: attempt.assessmentId,
      score,
      passed,
      submittedAt: attempt.submittedAt,
    };
  }
}
