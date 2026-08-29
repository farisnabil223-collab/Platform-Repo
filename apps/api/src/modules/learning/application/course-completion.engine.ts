import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class CourseCompletionEngine {
  async completeLesson(userId: string, lessonId: string, completedBy: 'MANUAL' | 'SYSTEM' = 'SYSTEM') {
    const lesson = await prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId },
      include: { module: true },
    });

    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    // 1. Create/update LessonProgress
    await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId: student.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        id: generateUuidV7(),
        studentId: student.id,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // 2. Create LessonCompletion
    await prisma.lessonCompletion.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completedAt: new Date(),
        completedBy,
      },
      create: {
        id: generateUuidV7(),
        userId,
        lessonId,
        completedAt: new Date(),
        completedBy,
      },
    });

    // 3. Publish Outbox Event
    await prisma.outboxEvent.create({
      data: {
        id: generateUuidV7(),
        aggregate: 'Lesson',
        eventType: 'LessonCompleted',
        payload: { userId, lessonId, completedBy },
      },
    });

    // 4. Trigger check for Course completion
    await this.checkCourseCompletion(userId, lesson.module.courseId);
  }

  async checkCourseCompletion(userId: string, courseId: string) {
    // Get all lessons in the course
    const courseLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });

    const lessonIds = courseLessons.map((l) => l.id);
    if (lessonIds.length === 0) return;

    // Get completed lessons by user
    const completions = await prisma.lessonCompletion.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
    });

    if (completions.length === lessonIds.length) {
      // All lessons are completed! Create CertificateEligibility record
      await prisma.certificateEligibility.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {
          status: 'ELIGIBLE',
          updatedAt: new Date(),
        },
        create: {
          id: generateUuidV7(),
          userId,
          courseId,
          status: 'ELIGIBLE',
        },
      });

      // Publish CourseCompleted outbox event
      await prisma.outboxEvent.create({
        data: {
          id: generateUuidV7(),
          aggregate: 'Course',
          eventType: 'CourseCompleted',
          payload: { userId, courseId },
        },
      });
    }
  }
}
