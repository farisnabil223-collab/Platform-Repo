import { Injectable, BadRequestException } from '@nestjs/common';
import { CourseProgressRepository, LessonProgressRepository, prisma } from '@eduverse/database';
import {
  LessonProgress,
  CourseProgress,
  CompletionPercentage,
  generateUuidV7,
  LessonCompletedEvent,
  ProgressUpdatedEvent,
  CertificateEligibilityReachedEvent,
  DomainEventBus
} from '@eduverse/kernel';

@Injectable()
export class CompleteLessonHandler {
  constructor(
    private readonly courseProgressRepository: CourseProgressRepository,
    private readonly lessonProgressRepository: LessonProgressRepository
  ) {}

  async execute(lessonId: string, studentId: string): Promise<void> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      throw new BadRequestException('Lesson not found');
    }

    const courseId = lesson.module.courseId;

    // 1. Mark lesson completed
    let lessonProgress = await this.lessonProgressRepository.findByStudentAndLesson(studentId, lessonId);
    if (!lessonProgress) {
      lessonProgress = new LessonProgress(generateUuidV7(), {
        studentId,
        lessonId,
        isCompleted: false,
        resumePosition: 0,
        watchOffset: 0,
      });
    }

    if (lessonProgress.isCompleted) {
      return; // Already completed
    }

    lessonProgress.complete();
    await this.lessonProgressRepository.save(lessonProgress);

    // 2. Fetch all course lessons
    const courseLessons = await prisma.lesson.findMany({
      where: {
        module: { courseId },
        deletedAt: null,
      },
    });

    const totalLessons = courseLessons.length;
    const completedCount = await prisma.lessonProgress.count({
      where: {
        studentId,
        lessonId: { in: courseLessons.map(l => l.id) },
        isCompleted: true,
      },
    });

    const score = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 100;
    const percentage = new CompletionPercentage(score);

    // 3. Update Course progress
    let courseProgress = await this.courseProgressRepository.findByStudentAndCourse(studentId, courseId);
    if (!courseProgress) {
      const activeVersion = await prisma.courseVersion.findFirst({
        where: { courseId, isActive: true },
      });
      if (!activeVersion) {
        throw new BadRequestException('No active course version found to bind progress tracking.');
      }

      courseProgress = new CourseProgress(generateUuidV7(), {
        studentId,
        courseId,
        courseVersionId: activeVersion.id,
        percentage,
        timeSpent: 0,
        activeLearningTime: 0,
        learningStreak: 1,
        lastAccessedAt: new Date(),
      });
    }

    courseProgress.updateProgress(percentage);
    courseProgress.updateAccess(lessonId);
    await this.courseProgressRepository.save(courseProgress);

    // 4. Publish events
    await DomainEventBus.getInstance().publish(new LessonCompletedEvent(studentId, lessonId));
    await DomainEventBus.getInstance().publish(new ProgressUpdatedEvent(studentId, courseId, percentage.value));

    if (percentage.value >= 100) {
      await DomainEventBus.getInstance().publish(new CertificateEligibilityReachedEvent(studentId, courseId));
    }
  }
}
