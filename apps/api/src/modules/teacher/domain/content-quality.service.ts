import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class ContentQualityService {
  async calculateCourseQualityScore(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) return 0;

    let score = 100;

    // Deduct for missing modules
    if (course.modules.length === 0) {
      score -= 40;
    } else {
      // Check each lesson's properties
      let totalLessons = 0;
      let shortDurationLessons = 0;

      for (const mod of course.modules) {
        totalLessons += mod.lessons.length;
        for (const les of mod.lessons) {
          if (les.estimatedDuration < 60) {
            shortDurationLessons++;
          }
        }
      }

      if (totalLessons === 0) {
        score -= 30;
      } else {
        const shortPercent = shortDurationLessons / totalLessons;
        score -= Math.floor(shortPercent * 20);
      }
    }

    // Check description fields
    if (!course.description || course.description.length < 50) {
      score -= 10;
    }

    return Math.max(score, 0);
  }
}
