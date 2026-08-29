import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import {
  MultipleChoiceScoring,
  MultipleSelectScoring,
  TrueFalseScoring,
} from '../domain/question-scoring.strategy';

@Injectable()
export class AssessmentScoringPipeline {
  private readonly mcScoring = new MultipleChoiceScoring();
  private readonly msScoring = new MultipleSelectScoring();
  private readonly tfScoring = new TrueFalseScoring();

  async scoreAttempt(attemptId: string) {
    const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
      where: { id: attemptId },
      include: { assessment: true, answers: true },
    });

    const snapshots = await prisma.questionSnapshot.findMany({
      where: { attemptId },
    });

    let totalScore = 0;

    for (const snap of snapshots) {
      const answer = attempt.answers.find((a) => a.questionId === snap.questionId);
      if (!answer || !answer.textResponse) continue;

      const userResponse = answer.textResponse;
      const correctResponse = (snap.correctAnswer as string[])[0];
      const maxPoints = (snap.scoringRules as any).pointsWeight || 1.0;

      // Polymorphic scoring strategy simulation
      const score = this.mcScoring.scoreAnswer(userResponse, correctResponse, maxPoints);
      totalScore += score;

      await prisma.questionAnswer.update({
        where: { id: answer.id },
        data: {
          pointsAwarded: score,
          isGraded: true,
        },
      });
    }

    // Normalized Score and Pass/Fail
    const maxScore = attempt.assessment.maxScore;
    const passingScore = attempt.assessment.passingScore;
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const passed = totalScore >= passingScore;

    // Create AssessmentResult
    const result = await prisma.assessmentResult.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        score: totalScore,
        percentage,
        grade: passed ? 'A' : 'F',
        passed,
        publishedAt: new Date(),
      },
    });

    // Update Attempt Status
    await prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: { status: 'AUTO_GRADED' },
    });

    // Create Outbox Events
    await prisma.outboxEvent.create({
      data: {
        id: generateUuidV7(),
        aggregate: 'Assessment',
        eventType: 'AssessmentGraded',
        payload: { attemptId, score: totalScore, percentage, passed },
      },
    });

    // Update Gradebook
    await this.updateGradebook(attempt.studentId, attempt.assessment.courseId!, attempt.assessmentId, totalScore, percentage);

    return result;
  }

  private async updateGradebook(
    studentId: string,
    courseId: string,
    assessmentId: string,
    score: number,
    percentage: number
  ) {
    // 1. Create or Find Gradebook
    const gradebook = await prisma.gradebook.upsert({
      where: {
        studentId_courseId: { studentId, courseId },
      },
      update: { updatedAt: new Date() },
      create: {
        id: generateUuidV7(),
        studentId,
        courseId,
      },
    });

    // 2. Create or Find GradeEntry
    await prisma.gradeEntry.upsert({
      where: {
        gradebookId_assessmentId: {
          gradebookId: gradebook.id,
          assessmentId,
        },
      },
      update: {
        score,
        percentage,
        updatedAt: new Date(),
      },
      create: {
        id: generateUuidV7(),
        gradebookId: gradebook.id,
        assessmentId,
        score,
        percentage,
      },
    });
  }
}
