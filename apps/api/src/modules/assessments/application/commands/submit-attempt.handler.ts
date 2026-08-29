import { Injectable, BadRequestException } from '@nestjs/common';
import { AssessmentAttemptRepository, AssessmentRepository, AssessmentResultRepository, prisma } from '@eduverse/database';
import {
  AssessmentSubmittedEvent,
  AssessmentGradedEvent,
  ResultPublishedEvent,
  Score,
  AssessmentResult,
  DomainEventBus,
  generateUuidV7
} from '@eduverse/kernel';

@Injectable()
export class SubmitAttemptHandler {
  constructor(
    private readonly attemptRepository: AssessmentAttemptRepository,
    private readonly assessmentRepository: AssessmentRepository,
    private readonly resultRepository: AssessmentResultRepository
  ) {}

  async execute(attemptId: string): Promise<AssessmentResult | null> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      throw new BadRequestException('Attempt not found');
    }

    if (attempt.status === 'SUBMITTED' || attempt.status === 'COMPLETED' || attempt.status === 'PUBLISHED') {
      throw new BadRequestException('Attempt already submitted or completed');
    }

    // 1. Submit attempt status
    attempt.submit();
    await this.attemptRepository.save(attempt);

    // 2. Fetch questions weights map
    const qMappings = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: attempt.assessmentId },
      include: {
        question: {
          include: { choices: true },
        },
      },
    });

    const studentAnswers = await prisma.questionAnswer.findMany({
      where: { attemptId },
    });

    let totalScore = 0;
    let pendingManualReview = false;

    // 3. Score calculation
    for (const mapping of qMappings) {
      const q = mapping.question;
      const pointsPossible = mapping.pointsWeight;
      const answerObj = studentAnswers.find(sa => sa.questionId === q.id);

      if (!answerObj) {
        continue; // Unanswered
      }

      // Check if it is a manual essay/file subjective question
      if (q.type === 'ESSAY' || q.type === 'FILE_UPLOAD' || q.type === 'DRAWING') {
        pendingManualReview = true;
        continue;
      }

      // Auto-grading objective questions
      const correctChoices = q.choices.filter(c => c.isCorrect);
      const studentChoices = answerObj.selectedChoice;

      let scoreEarned = 0;

      // Handle choices points
      if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
        const selectedCorrect = correctChoices.some(c => studentChoices.includes(c.id));
        scoreEarned = selectedCorrect ? pointsPossible : 0;
      } else if (q.type === 'MULTIPLE_SELECT') {
        // Partial Marks logic: ratio of matching correct items
        const matchedCorrect = correctChoices.filter(c => studentChoices.includes(c.id)).length;
        const totalCorrect = correctChoices.length;

        // Negative marks deduction
        const wrongSelections = studentChoices.filter(id => !correctChoices.some(c => c.id === id)).length;
        const matchedScore = totalCorrect > 0 ? (matchedCorrect / totalCorrect) * pointsPossible : 0;
        const penalty = wrongSelections * 0.25 * pointsPossible;

        scoreEarned = Math.max(0, matchedScore - penalty);
      } else {
        // Default direct match
        const exactMatch =
          correctChoices.length === studentChoices.length &&
          correctChoices.every(c => studentChoices.includes(c.id));
        scoreEarned = exactMatch ? pointsPossible : 0;
      }

      totalScore += scoreEarned;

      await prisma.questionAnswer.update({
        where: { id: answerObj.id },
        data: {
          pointsAwarded: scoreEarned,
          isGraded: true,
        },
      });
    }

    // 4. Manual review check
    if (pendingManualReview) {
      attempt.updateStatus('MANUAL_REVIEW');
      await this.attemptRepository.save(attempt);

      // Create GradingReview entry
      await prisma.gradingReview.create({
        data: {
          id: generateUuidV7(),
          attemptId,
          reviewerId: generateUuidV7(), // Mock auto-assigned reviewer uuid placeholder
          status: 'PENDING',
        },
      });

      await DomainEventBus.getInstance().publish(
        new AssessmentSubmittedEvent(attemptId, attempt.studentId, attempt.assessmentId)
      );

      return null;
    }

    // 5. Direct complete scoring
    attempt.updateStatus('COMPLETED');
    await this.attemptRepository.save(attempt);

    const assessment = await this.assessmentRepository.findById(attempt.assessmentId);
    const maxPoss = assessment?.maxScore.value ?? 100.0;
    const percentage = maxPoss > 0 ? (totalScore / maxPoss) * 100 : 100.0;
    const passed = percentage >= (assessment?.passingScore.value ?? 70.0);

    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'F';
    const resultId = generateUuidV7();

    const result = new AssessmentResult(resultId, {
      attemptId,
      score: new Score(totalScore),
      percentage,
      grade,
      passed,
      publishedAt: new Date(),
    });

    await this.resultRepository.save(result);

    // Update Statistics in background asynchronously
    await prisma.assessmentStatistics.create({
      data: {
        id: generateUuidV7(),
        assessmentId: attempt.assessmentId,
        averageScore: totalScore,
        medianScore: totalScore,
        standardDeviation: 0.0,
        passRate: passed ? 100.0 : 0.0,
        completionTimeAvg: 120.0,
        questionDifficulty: {},
      },
    });

    // Publish events
    await DomainEventBus.getInstance().publish(
      new AssessmentSubmittedEvent(attemptId, attempt.studentId, attempt.assessmentId)
    );
    await DomainEventBus.getInstance().publish(
      new AssessmentGradedEvent(attemptId, totalScore, passed)
    );
    await DomainEventBus.getInstance().publish(
      new ResultPublishedEvent(resultId, attemptId, totalScore)
    );

    return result;
  }
}
