import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { LessonAccessPolicy } from '../domain/lesson-access.policy';

@Injectable()
export class CourseNavigationService {
  constructor(private readonly accessPolicy: LessonAccessPolicy) {}

  async getCourseStructure(userId: string, courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const sections = [];
    for (const mod of course.modules) {
      const lessons = [];
      for (const les of mod.lessons) {
        let isLocked = false;
        let lockReason: string | null = null;
        try {
          await this.accessPolicy.validateAccess(userId, les.id);
        } catch (error: any) {
          isLocked = true;
          lockReason = error.message || 'Locked';
        }

        const progress = await prisma.lessonProgress.findUnique({
          where: {
            studentId_lessonId: {
              studentId: userId,
              lessonId: les.id,
            },
          },
        });

        lessons.push({
          id: les.id,
          title: les.title,
          estimatedDuration: les.estimatedDuration,
          isLocked,
          lockReason,
          isCompleted: progress ? progress.isCompleted : false,
          resumePosition: progress ? progress.resumePosition : 0,
        });
      }

      sections.push({
        id: mod.id,
        title: mod.title,
        lessons,
      });
    }

    return {
      courseId: course.id,
      title: course.title,
      sections,
    };
  }

  async getLessonNavigation(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId },
      include: { module: { include: { lessons: { orderBy: { sortOrder: 'asc' } } } } },
    });

    const siblings = lesson.module.lessons;
    const currentIndex = siblings.findIndex((l) => l.id === lessonId);

    const prevLesson = currentIndex > 0 ? siblings[currentIndex - 1] : null;
    const nextLesson = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

    return {
      currentLessonId: lessonId,
      prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
    };
  }
}
