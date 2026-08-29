import { Injectable } from '@nestjs/common';
import { IRecommendationProvider } from './scoring-providers.interface';

@Injectable()
export class StudentRecommendationEngine implements IRecommendationProvider {
  async getRecommendations(studentId: string): Promise<any[]> {
    return [
      {
        recommendationType: 'REVIEW_LESSON',
        description: 'Review the algebra module lessons to boost test scores.',
        confidenceScore: 0.85,
      },
      {
        recommendationType: 'STUDY_GROUP',
        description: 'Join the peer study session scheduled for next Tuesday.',
        confidenceScore: 0.72,
      },
    ];
  }
}
