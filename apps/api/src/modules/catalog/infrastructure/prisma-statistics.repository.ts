import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { IStatisticsRepository } from '../domain/statistics.repository.interface';

@Injectable()
export class PrismaStatisticsRepository implements IStatisticsRepository {
  async getCoursesCount(): Promise<number> {
    return prisma.course.count({ where: { deletedAt: null } });
  }

  async getTeachersCount(): Promise<number> {
    return prisma.teacher.count({ where: { deletedAt: null } });
  }

  async getStudentsCount(): Promise<number> {
    return prisma.student.count({ where: { deletedAt: null } });
  }

  async getReviewsCount(): Promise<number> {
    return prisma.courseReview.count({ where: { deletedAt: null, status: 'APPROVED' } });
  }
}
