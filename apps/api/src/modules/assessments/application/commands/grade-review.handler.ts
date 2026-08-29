import { Injectable, BadRequestException } from '@nestjs/common';
import { AssessmentAttemptRepository, AssessmentRepository, AssessmentResultRepository, prisma } from '@eduverse/database';
import {
  AssessmentGradedEvent,
  ResultPublishedEvent,
  Score,
  AssessmentResult,
  DomainEventBus,
  generateUuidV7
} from '@eduverse/kernel';
import { ManualGradeDto } from '../../dto/assessment.dto';

@Injectable()
export class GradeReviewHandler {
  constructor(
    private readonly attemptRepository: AssessmentAttemptRepository,
    private readonly assessmentRepository: AssessmentRepository,
    private readonly resultRepository: AssessmentResultRepository
  ) {}

  async execute(attemptId: string, dto: ManualGradeDto): Promise<AssessmentResult | null> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      throw new BadRequestException('Attempt not found');
    }

    if (attempt.status !== 'MANUAL_REVIEW') {
      throw new BadRequestException('Attempt is not in manual grading review state.');
    }

    // 1. Grade the subjective question response
    const qa = await prisma.questionAnswer.findUnique({
      where: {
        attemptId_questionId: { attemptId, questionId: dto.questionId },
      },
    });

    if (!qa) {
      throw new BadRequestException('Answer response not found for this question.');
    }

    await prisma.questionAnswer.update({
      where: { id: qa.id },
      data: {
        pointsAwarded: dto.points,
        isGraded: true,
        feedback: dto.feedback,
      },
    });

    // 2. Check if all questions in this attempt are graded
    const ungradedCount = await prisma.questionAnswer.count({
      where: { attemptId, isGraded: false },
    });

    if (ungradedCount > 0) {
      return null; // Still waiting for other reviews
    }

    // 3. Mark completed and generate final results
    attempt.updateStatus('COMPLETED');
    await this.attemptRepository.save(attempt);

    // Close review queue item
    const reviewItem = await prisma.gradingReview.findFirst({
      where: { attemptId, status: 'PENDING' },
    });
    if (reviewItem) {
      await prisma.gradingReview.update({
        where: { id: reviewItem.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    }

    // Sum all points
    const answers = await prisma.questionAnswer.findMany({
      where: { attemptId },
    });
    const totalScore = answers.reduce((sum, item) => sum + (item.pointsAwarded ?? 0.0), 0.0);

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

    // Publish events
    await DomainEventBus.getInstance().publish(
      new AssessmentGradedEvent(attemptId, totalScore, passed)
    );
    await DomainEventBus.getInstance().publish(
      new ResultPublishedEvent(resultId, attemptId, totalScore)
    );

    return result;
  }
}
