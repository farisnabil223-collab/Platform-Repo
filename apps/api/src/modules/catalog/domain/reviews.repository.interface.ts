export interface ICourseReview {
  id: string;
  courseId: string;
  authorName: string;
  rating: number;
  content: string;
  verified: boolean;
  status: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  createdAt: Date;
}

export interface IReviewsRepository {
  findByCourseId(courseId: string): Promise<ICourseReview[]>;
  create(review: {
    id: string;
    courseId: string;
    authorName: string;
    rating: number;
    content: string;
    verified?: boolean;
    status?: string;
    isVerifiedPurchase?: boolean;
  }): Promise<ICourseReview>;
  incrementHelpful(id: string): Promise<void>;
  report(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<void>;
}
export const IReviewsRepository = Symbol('IReviewsRepository');
