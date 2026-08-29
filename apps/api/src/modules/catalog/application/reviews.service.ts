import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IReviewsRepository, ICourseReview } from '../domain/reviews.repository.interface';
import { DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { ReviewCreatedEvent } from '../domain/events/review-created.event';
import { AuditLogService } from '../../audit/application/audit-log.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
    private readonly auditLogService: AuditLogService
  ) {}

  async getReviewsForCourse(courseId: string): Promise<ICourseReview[]> {
    return this.reviewsRepository.findByCourseId(courseId);
  }

  async submitReview(params: {
    courseId: string;
    authorName: string;
    rating: number;
    content: string;
    userId: string | null;
    isVerifiedPurchase?: boolean;
  }): Promise<ICourseReview> {
    if (params.rating < 1 || params.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const reviewId = generateUuidV7();
    // Default: reviews from verified purchases are auto-approved, others are pending
    const status = params.isVerifiedPurchase ? 'APPROVED' : 'PENDING';

    const review = await this.reviewsRepository.create({
      id: reviewId,
      courseId: params.courseId,
      authorName: params.authorName,
      rating: params.rating,
      content: params.content,
      verified: true,
      status,
      isVerifiedPurchase: params.isVerifiedPurchase || false,
    });

    // Dispatch Domain Event
    const event = new ReviewCreatedEvent(
      reviewId,
      params.courseId,
      params.authorName,
      params.rating,
      params.content
    );
    await DomainEventBus.getInstance().publish(event);

    // Audit Trail
    await this.auditLogService.log({
      userId: params.userId,
      action: 'REVIEW_CREATED',
      entity: 'CourseReview',
      entityId: reviewId,
      details: { courseId: params.courseId, rating: params.rating, status },
    });

    return review;
  }

  async voteHelpful(reviewId: string, userId: string | null): Promise<void> {
    await this.reviewsRepository.incrementHelpful(reviewId);
    await this.auditLogService.log({
      userId,
      action: 'REVIEW_HELPFUL_VOTED',
      entity: 'CourseReview',
      entityId: reviewId,
    });
  }

  async reportReview(reviewId: string, userId: string | null): Promise<void> {
    await this.reviewsRepository.report(reviewId);
    await this.auditLogService.log({
      userId,
      action: 'REVIEW_REPORTED',
      entity: 'CourseReview',
      entityId: reviewId,
    });
  }

  async moderateReview(reviewId: string, status: 'APPROVED' | 'REJECTED', userId: string | null): Promise<void> {
    await this.reviewsRepository.updateStatus(reviewId, status);
    await this.auditLogService.log({
      userId,
      action: status === 'APPROVED' ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED',
      entity: 'CourseReview',
      entityId: reviewId,
    });
  }
}
