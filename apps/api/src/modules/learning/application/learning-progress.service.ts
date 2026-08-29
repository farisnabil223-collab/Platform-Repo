import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { CourseCompletionEngine } from './course-completion.engine';

@Injectable()
export class LearningProgressService {
  constructor(private readonly completionEngine: CourseCompletionEngine) {}

  async syncProgress(
    userId: string,
    lessonId: string,
    timeWatched: number,
    duration: number,
    resumePosition: number
  ) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    const progressPercent = duration > 0 ? (timeWatched / duration) * 100 : 0;
    const isCompleted = progressPercent >= 95;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId: student.id,
          lessonId,
        },
      },
      update: {
        resumePosition,
        watchOffset: timeWatched,
        updatedAt: new Date(),
      },
      create: {
        id: generateUuidV7(),
        studentId: student.id,
        lessonId,
        resumePosition,
        watchOffset: timeWatched,
      },
    });

    // Write watch history logs
    await prisma.watchHistory.create({
      data: {
        id: generateUuidV7(),
        studentId: student.id,
        mediaAssetId: lessonId, // mapping to mediaAsset/lesson
        secondsOffset: resumePosition,
        lastHeartbeat: new Date(),
      },
    });

    // Auto complete if watched duration >= 95%
    if (isCompleted) {
      await this.completionEngine.completeLesson(userId, lessonId, 'SYSTEM');
    }

    return {
      success: true,
      progressPercent,
      isCompleted: isCompleted || progress.isCompleted,
    };
  }

  async getResumePosition(userId: string, courseId: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    // Find last activity progress in the course
    const lastProgress = await prisma.lessonProgress.findFirst({
      where: {
        studentId: student.id,
        lesson: { module: { courseId } },
      },
      orderBy: { updatedAt: 'desc' },
      include: { lesson: true },
    });

    return {
      lastLesson: lastProgress ? { id: lastProgress.lesson.id, title: lastProgress.lesson.title } : null,
      resumePosition: lastProgress ? lastProgress.resumePosition : 0,
    };
  }
}
