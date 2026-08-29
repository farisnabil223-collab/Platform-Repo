import { Injectable, Inject } from '@nestjs/common';
import { IStatisticsRepository } from '../domain/statistics.repository.interface';

@Injectable()
export class StatisticsAggregatorService {
  constructor(
    @Inject(IStatisticsRepository)
    private readonly statisticsRepository: IStatisticsRepository
  ) {}

  async getLiveStats(): Promise<{
    courses: number;
    teachers: number;
    students: number;
    reviews: number;
  }> {
    const [courses, teachers, students, reviews] = await Promise.all([
      this.statisticsRepository.getCoursesCount(),
      this.statisticsRepository.getTeachersCount(),
      this.statisticsRepository.getStudentsCount(),
      this.statisticsRepository.getReviewsCount(),
    ]);

    return {
      courses,
      teachers,
      students,
      reviews,
    };
  }
}
