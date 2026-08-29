import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
}

class ReviewsRepository extends BaseRepository {
  async getByCourseId(courseId: string): Promise<Review[]> {
    try {
      const response = await api.get<any>(`/public/reviews/course/${courseId}`);
      const apiItems = response.data || [];
      return apiItems.map((r: any) => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        content: r.content,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        isVerifiedPurchase: r.isVerifiedPurchase || false,
        helpfulCount: r.helpfulCount || 0,
      }));
    } catch (error) {
      this.handleError(`getReviewsForCourse(${courseId})`, error);
      return [];
    }
  }

  async submitReview(courseId: string, params: { authorName: string; rating: number; content: string }): Promise<Review | null> {
    try {
      const response = await api.post<any>(`/public/reviews/course/${courseId}`, params);
      return response.data || null;
    } catch (error) {
      this.handleError(`submitReview(${courseId})`, error);
      return null;
    }
  }

  async voteHelpful(_reviewId: string): Promise<boolean> {
    return true;
  }
}

export const reviewsRepository = new ReviewsRepository();
export default reviewsRepository;
