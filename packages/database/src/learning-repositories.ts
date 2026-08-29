import {
  ICourseRepository,
  ICourseVersionRepository,
  IModuleRepository,
  ILessonRepository,
  ILearningContentRepository,
  IMediaAssetRepository,
  ICourseProgressRepository,
  ILessonProgressRepository,
  IQuizRepository,
  IAssignmentRepository,
  Course,
  CourseCode,
  CourseSlug,
  CourseVersion,
  VersionNumber,
  Module,
  ModuleCode,
  Lesson,
  LessonCode,
  LearningContent,
  ContentType,
  MediaAsset,
  CourseProgress,
  CompletionPercentage,
  LessonProgress,
  Quiz,
  Assignment
} from '@eduverse/kernel';
import { prisma } from './index';

export class CourseRepository implements ICourseRepository {
  async findById(id: string): Promise<Course | null> {
    const row = await prisma.course.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Course(row.id, {
      code: new CourseCode(row.code),
      slug: new CourseSlug(row.slug),
      title: row.title,
      description: row.description || undefined,
      status: row.status as any,
      teacherId: row.teacherId,
      currentVersionId: row.currentVersionId || undefined,
      version: row.version,
    }, row.version);
  }

  async findByCode(code: string): Promise<Course | null> {
    const row = await prisma.course.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Course(row.id, {
      code: new CourseCode(row.code),
      slug: new CourseSlug(row.slug),
      title: row.title,
      description: row.description || undefined,
      status: row.status as any,
      teacherId: row.teacherId,
      currentVersionId: row.currentVersionId || undefined,
      version: row.version,
    }, row.version);
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const row = await prisma.course.findFirst({ where: { slug, deletedAt: null } });
    if (!row) return null;
    return new Course(row.id, {
      code: new CourseCode(row.code),
      slug: new CourseSlug(row.slug),
      title: row.title,
      description: row.description || undefined,
      status: row.status as any,
      teacherId: row.teacherId,
      currentVersionId: row.currentVersionId || undefined,
      version: row.version,
    }, row.version);
  }

  async findAll(): Promise<Course[]> {
    const rows = await prisma.course.findMany({ where: { deletedAt: null } });
    return rows.map(row => new Course(row.id, {
      code: new CourseCode(row.code),
      slug: new CourseSlug(row.slug),
      title: row.title,
      description: row.description || undefined,
      status: row.status as any,
      teacherId: row.teacherId,
      currentVersionId: row.currentVersionId || undefined,
      version: row.version,
    }, row.version));
  }

  async save(entity: Course): Promise<void> {
    await prisma.course.upsert({
      where: { id: entity.id },
      update: {
        code: entity.code.value,
        slug: entity.slug.value,
        title: entity.title,
        description: entity.description,
        status: entity.status as any,
        teacherId: entity.teacherId,
        currentVersionId: entity.currentVersionId,
        version: entity.version,
      },
      create: {
        id: entity.id,
        code: entity.code.value,
        slug: entity.slug.value,
        title: entity.title,
        description: entity.description,
        status: entity.status as any,
        teacherId: entity.teacherId,
        currentVersionId: entity.currentVersionId,
        version: entity.version,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class CourseVersionRepository implements ICourseVersionRepository {
  async findById(id: string): Promise<CourseVersion | null> {
    const row = await prisma.courseVersion.findUnique({ where: { id } });
    if (!row) return null;
    return new CourseVersion(row.id, {
      courseId: row.courseId,
      semver: new VersionNumber(row.semver),
      structure: row.structure,
      isActive: row.isActive,
    });
  }

  async findByVersionNum(courseId: string, semver: string): Promise<CourseVersion | null> {
    const row = await prisma.courseVersion.findFirst({
      where: { courseId, semver },
    });
    if (!row) return null;
    return new CourseVersion(row.id, {
      courseId: row.courseId,
      semver: new VersionNumber(row.semver),
      structure: row.structure,
      isActive: row.isActive,
    });
  }

  async findActiveVersion(courseId: string): Promise<CourseVersion | null> {
    const row = await prisma.courseVersion.findFirst({
      where: { courseId, isActive: true },
    });
    if (!row) return null;
    return new CourseVersion(row.id, {
      courseId: row.courseId,
      semver: new VersionNumber(row.semver),
      structure: row.structure,
      isActive: row.isActive,
    });
  }

  async findAll(): Promise<CourseVersion[]> {
    const rows = await prisma.courseVersion.findMany();
    return rows.map(row => new CourseVersion(row.id, {
      courseId: row.courseId,
      semver: new VersionNumber(row.semver),
      structure: row.structure,
      isActive: row.isActive,
    }));
  }

  async save(entity: CourseVersion): Promise<void> {
    await prisma.courseVersion.upsert({
      where: { id: entity.id },
      update: {
        courseId: entity.courseId,
        semver: entity.semver.value,
        structure: entity.structure || {},
        isActive: entity.isActive,
      },
      create: {
        id: entity.id,
        courseId: entity.courseId,
        semver: entity.semver.value,
        structure: entity.structure || {},
        isActive: entity.isActive,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.courseVersion.delete({ where: { id } });
  }
}

export class ModuleRepository implements IModuleRepository {
  async findById(id: string): Promise<Module | null> {
    const row = await prisma.module.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Module(row.id, {
      courseId: row.courseId,
      code: new ModuleCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
    });
  }

  async findByCode(code: string): Promise<Module | null> {
    const row = await prisma.module.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Module(row.id, {
      courseId: row.courseId,
      code: new ModuleCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
    });
  }

  async findByCourseId(courseId: string): Promise<Module[]> {
    const rows = await prisma.module.findMany({ where: { courseId, deletedAt: null } });
    return rows.map(row => new Module(row.id, {
      courseId: row.courseId,
      code: new ModuleCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
    }));
  }

  async findAll(): Promise<Module[]> {
    const rows = await prisma.module.findMany({ where: { deletedAt: null } });
    return rows.map(row => new Module(row.id, {
      courseId: row.courseId,
      code: new ModuleCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
    }));
  }

  async save(entity: Module): Promise<void> {
    await prisma.module.upsert({
      where: { id: entity.id },
      update: {
        courseId: entity.courseId,
        code: entity.code.value,
        title: entity.title,
        sortOrder: entity.sortOrder,
      },
      create: {
        id: entity.id,
        courseId: entity.courseId,
        code: entity.code.value,
        title: entity.title,
        sortOrder: entity.sortOrder,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.module.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class LessonRepository implements ILessonRepository {
  async findById(id: string): Promise<Lesson | null> {
    const row = await prisma.lesson.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Lesson(row.id, {
      moduleId: row.moduleId,
      code: new LessonCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
      displayOrder: row.displayOrder,
      estimatedDuration: row.estimatedDuration,
      isLocked: row.isLocked,
      unlockCondition: row.unlockCondition || undefined,
    });
  }

  async findByCode(code: string): Promise<Lesson | null> {
    const row = await prisma.lesson.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Lesson(row.id, {
      moduleId: row.moduleId,
      code: new LessonCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
      displayOrder: row.displayOrder,
      estimatedDuration: row.estimatedDuration,
      isLocked: row.isLocked,
      unlockCondition: row.unlockCondition || undefined,
    });
  }

  async findByModuleId(moduleId: string): Promise<Lesson[]> {
    const rows = await prisma.lesson.findMany({ where: { moduleId, deletedAt: null } });
    return rows.map(row => new Lesson(row.id, {
      moduleId: row.moduleId,
      code: new LessonCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
      displayOrder: row.displayOrder,
      estimatedDuration: row.estimatedDuration,
      isLocked: row.isLocked,
      unlockCondition: row.unlockCondition || undefined,
    }));
  }

  async findAll(): Promise<Lesson[]> {
    const rows = await prisma.lesson.findMany({ where: { deletedAt: null } });
    return rows.map(row => new Lesson(row.id, {
      moduleId: row.moduleId,
      code: new LessonCode(row.code),
      title: row.title,
      sortOrder: row.sortOrder,
      displayOrder: row.displayOrder,
      estimatedDuration: row.estimatedDuration,
      isLocked: row.isLocked,
      unlockCondition: row.unlockCondition || undefined,
    }));
  }

  async save(entity: Lesson): Promise<void> {
    await prisma.lesson.upsert({
      where: { id: entity.id },
      update: {
        moduleId: entity.moduleId,
        code: entity.code.value,
        title: entity.title,
        sortOrder: entity.sortOrder,
        displayOrder: entity.displayOrder,
        estimatedDuration: entity.estimatedDuration,
        isLocked: entity.isLocked,
        unlockCondition: entity.unlockCondition || {},
      },
      create: {
        id: entity.id,
        moduleId: entity.moduleId,
        code: entity.code.value,
        title: entity.title,
        sortOrder: entity.sortOrder,
        displayOrder: entity.displayOrder,
        estimatedDuration: entity.estimatedDuration,
        isLocked: entity.isLocked,
        unlockCondition: entity.unlockCondition || {},
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class LearningContentRepository implements ILearningContentRepository {
  async findById(id: string): Promise<LearningContent | null> {
    const row = await prisma.learningContent.findUnique({ where: { id } });
    if (!row) return null;
    return new LearningContent(row.id, {
      lessonId: row.lessonId,
      contentType: new ContentType(row.contentType as any),
      title: row.title,
      sortOrder: row.sortOrder,
      currentVersionId: row.currentVersionId || undefined,
      quizId: row.quizId || undefined,
      assignmentId: row.assignmentId || undefined,
    });
  }

  async findByLessonId(lessonId: string): Promise<LearningContent[]> {
    const rows = await prisma.learningContent.findMany({ where: { lessonId } });
    return rows.map(row => new LearningContent(row.id, {
      lessonId: row.lessonId,
      contentType: new ContentType(row.contentType as any),
      title: row.title,
      sortOrder: row.sortOrder,
      currentVersionId: row.currentVersionId || undefined,
      quizId: row.quizId || undefined,
      assignmentId: row.assignmentId || undefined,
    }));
  }

  async findAll(): Promise<LearningContent[]> {
    const rows = await prisma.learningContent.findMany();
    return rows.map(row => new LearningContent(row.id, {
      lessonId: row.lessonId,
      contentType: new ContentType(row.contentType as any),
      title: row.title,
      sortOrder: row.sortOrder,
      currentVersionId: row.currentVersionId || undefined,
      quizId: row.quizId || undefined,
      assignmentId: row.assignmentId || undefined,
    }));
  }

  async save(entity: LearningContent): Promise<void> {
    await prisma.learningContent.upsert({
      where: { id: entity.id },
      update: {
        lessonId: entity.lessonId,
        contentType: entity.contentType.value as any,
        title: entity.title,
        sortOrder: entity.sortOrder,
        currentVersionId: entity.currentVersionId,
        quizId: entity.quizId,
        assignmentId: entity.assignmentId,
      },
      create: {
        id: entity.id,
        lessonId: entity.lessonId,
        contentType: entity.contentType.value as any,
        title: entity.title,
        sortOrder: entity.sortOrder,
        currentVersionId: entity.currentVersionId,
        quizId: entity.quizId,
        assignmentId: entity.assignmentId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.learningContent.delete({ where: { id } });
  }
}

export class MediaAssetRepository implements IMediaAssetRepository {
  async findById(id: string): Promise<MediaAsset | null> {
    const row = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!row) return null;
    return new MediaAsset(row.id, {
      title: row.title,
      storageProvider: row.storageProvider,
      storagePath: row.storagePath,
      streamingUrl: row.streamingUrl || undefined,
      subtitles: row.subtitles || undefined,
      status: row.status as any,
      errorMessage: row.errorMessage || undefined,
    });
  }

  async findByStoragePath(path: string): Promise<MediaAsset | null> {
    const row = await prisma.mediaAsset.findFirst({ where: { storagePath: path } });
    if (!row) return null;
    return new MediaAsset(row.id, {
      title: row.title,
      storageProvider: row.storageProvider,
      storagePath: row.storagePath,
      streamingUrl: row.streamingUrl || undefined,
      subtitles: row.subtitles || undefined,
      status: row.status as any,
      errorMessage: row.errorMessage || undefined,
    });
  }

  async findAll(): Promise<MediaAsset[]> {
    const rows = await prisma.mediaAsset.findMany();
    return rows.map(row => new MediaAsset(row.id, {
      title: row.title,
      storageProvider: row.storageProvider,
      storagePath: row.storagePath,
      streamingUrl: row.streamingUrl || undefined,
      subtitles: row.subtitles || undefined,
      status: row.status as any,
      errorMessage: row.errorMessage || undefined,
    }));
  }

  async save(entity: MediaAsset): Promise<void> {
    await prisma.mediaAsset.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        storageProvider: entity.storageProvider,
        storagePath: entity.storagePath,
        streamingUrl: entity.streamingUrl,
        subtitles: entity.subtitles || {},
        status: entity.status as any,
        errorMessage: entity.errorMessage,
      },
      create: {
        id: entity.id,
        title: entity.title,
        storageProvider: entity.storageProvider,
        storagePath: entity.storagePath,
        streamingUrl: entity.streamingUrl,
        subtitles: entity.subtitles || {},
        status: entity.status as any,
        errorMessage: entity.errorMessage,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.mediaAsset.delete({ where: { id } });
  }
}

export class CourseProgressRepository implements ICourseProgressRepository {
  async findById(id: string): Promise<CourseProgress | null> {
    const row = await prisma.courseProgress.findUnique({ where: { id } });
    if (!row) return null;
    return new CourseProgress(row.id, {
      studentId: row.studentId,
      courseId: row.courseId,
      courseVersionId: row.courseVersionId,
      percentage: new CompletionPercentage(row.percentage),
      timeSpent: row.timeSpent,
      activeLearningTime: row.activeLearningTime,
      learningStreak: row.learningStreak,
      lastLessonId: row.lastLessonId || undefined,
      lastAccessedAt: row.lastAccessedAt,
      completedAt: row.completedAt || undefined,
    });
  }

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<CourseProgress | null> {
    const row = await prisma.courseProgress.findFirst({
      where: { studentId, courseId },
    });
    if (!row) return null;
    return new CourseProgress(row.id, {
      studentId: row.studentId,
      courseId: row.courseId,
      courseVersionId: row.courseVersionId,
      percentage: new CompletionPercentage(row.percentage),
      timeSpent: row.timeSpent,
      activeLearningTime: row.activeLearningTime,
      learningStreak: row.learningStreak,
      lastLessonId: row.lastLessonId || undefined,
      lastAccessedAt: row.lastAccessedAt,
      completedAt: row.completedAt || undefined,
    });
  }

  async findAll(): Promise<CourseProgress[]> {
    const rows = await prisma.courseProgress.findMany();
    return rows.map(row => new CourseProgress(row.id, {
      studentId: row.studentId,
      courseId: row.courseId,
      courseVersionId: row.courseVersionId,
      percentage: new CompletionPercentage(row.percentage),
      timeSpent: row.timeSpent,
      activeLearningTime: row.activeLearningTime,
      learningStreak: row.learningStreak,
      lastLessonId: row.lastLessonId || undefined,
      lastAccessedAt: row.lastAccessedAt,
      completedAt: row.completedAt || undefined,
    }));
  }

  async save(entity: CourseProgress): Promise<void> {
    await prisma.courseProgress.upsert({
      where: { id: entity.id },
      update: {
        studentId: entity.studentId,
        courseId: entity.courseId,
        courseVersionId: entity.courseVersionId,
        percentage: entity.percentage.value,
        timeSpent: entity.timeSpent,
        activeLearningTime: entity.activeLearningTime,
        learningStreak: entity.learningStreak,
        lastLessonId: entity.lastLessonId,
        lastAccessedAt: entity.lastAccessedAt,
        completedAt: entity.completedAt,
      },
      create: {
        id: entity.id,
        studentId: entity.studentId,
        courseId: entity.courseId,
        courseVersionId: entity.courseVersionId,
        percentage: entity.percentage.value,
        timeSpent: entity.timeSpent,
        activeLearningTime: entity.activeLearningTime,
        learningStreak: entity.learningStreak,
        lastLessonId: entity.lastLessonId,
        lastAccessedAt: entity.lastAccessedAt,
        completedAt: entity.completedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.courseProgress.delete({ where: { id } });
  }
}

export class LessonProgressRepository implements ILessonProgressRepository {
  async findById(id: string): Promise<LessonProgress | null> {
    const row = await prisma.lessonProgress.findUnique({ where: { id } });
    if (!row) return null;
    return new LessonProgress(row.id, {
      studentId: row.studentId,
      lessonId: row.lessonId,
      isCompleted: row.isCompleted,
      completedAt: row.completedAt || undefined,
      resumePosition: row.resumePosition,
      watchOffset: row.watchOffset,
    });
  }

  async findByStudentAndLesson(studentId: string, lessonId: string): Promise<LessonProgress | null> {
    const row = await prisma.lessonProgress.findFirst({
      where: { studentId, lessonId },
    });
    if (!row) return null;
    return new LessonProgress(row.id, {
      studentId: row.studentId,
      lessonId: row.lessonId,
      isCompleted: row.isCompleted,
      completedAt: row.completedAt || undefined,
      resumePosition: row.resumePosition,
      watchOffset: row.watchOffset,
    });
  }

  async findAll(): Promise<LessonProgress[]> {
    const rows = await prisma.lessonProgress.findMany();
    return rows.map(row => new LessonProgress(row.id, {
      studentId: row.studentId,
      lessonId: row.lessonId,
      isCompleted: row.isCompleted,
      completedAt: row.completedAt || undefined,
      resumePosition: row.resumePosition,
      watchOffset: row.watchOffset,
    }));
  }

  async save(entity: LessonProgress): Promise<void> {
    await prisma.lessonProgress.upsert({
      where: { id: entity.id },
      update: {
        studentId: entity.studentId,
        lessonId: entity.lessonId,
        isCompleted: entity.isCompleted,
        completedAt: entity.completedAt,
        resumePosition: entity.resumePosition,
        watchOffset: entity.watchOffset,
      },
      create: {
        id: entity.id,
        studentId: entity.studentId,
        lessonId: entity.lessonId,
        isCompleted: entity.isCompleted,
        completedAt: entity.completedAt,
        resumePosition: entity.resumePosition,
        watchOffset: entity.watchOffset,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.lessonProgress.delete({ where: { id } });
  }
}

export class QuizRepository implements IQuizRepository {
  async findById(id: string): Promise<Quiz | null> {
    const row = await prisma.assessment.findFirst({ where: { id, type: 'QUIZ' } });
    if (!row) return null;
    return new Quiz(row.id, {
      title: row.title,
      passingScore: row.passingScore,
      timeLimitSeconds: row.durationSeconds,
      isActive: row.status === 'OPEN' || row.status === 'PUBLISHED',
    });
  }

  async findAll(): Promise<Quiz[]> {
    const rows = await prisma.assessment.findMany({ where: { type: 'QUIZ' } });
    return rows.map(row => new Quiz(row.id, {
      title: row.title,
      passingScore: row.passingScore,
      timeLimitSeconds: row.durationSeconds,
      isActive: row.status === 'OPEN' || row.status === 'PUBLISHED',
    }));
  }

  async save(entity: Quiz): Promise<void> {
    await prisma.assessment.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        type: 'QUIZ',
        passingScore: entity.passingScore,
        durationSeconds: entity.timeLimitSeconds,
        status: entity.isActive ? 'OPEN' : 'DRAFT',
        maxScore: 100.0, // default placeholder
        code: `ASM_QUIZ_${entity.id.substring(0, 8).toUpperCase()}`,
        settings: {},
      },
      create: {
        id: entity.id,
        title: entity.title,
        type: 'QUIZ',
        passingScore: entity.passingScore,
        durationSeconds: entity.timeLimitSeconds,
        status: entity.isActive ? 'OPEN' : 'DRAFT',
        maxScore: 100.0,
        code: `ASM_QUIZ_${entity.id.substring(0, 8).toUpperCase()}`,
        settings: {},
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.assessment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class AssignmentRepository implements IAssignmentRepository {
  async findById(id: string): Promise<Assignment | null> {
    const row = await prisma.assignment.findUnique({ where: { id } });
    if (!row) return null;
    return new Assignment(row.id, {
      title: row.title,
      instructions: row.instructions || undefined,
      maxScore: row.maxScore,
      dueDate: row.dueDate || undefined,
      rubric: row.rubric || undefined,
      gradingCriteria: row.gradingCriteria || undefined,
      maxAttempts: row.maxAttempts,
      lateSubmissionPolicy: row.lateSubmissionPolicy || undefined,
    });
  }

  async findAll(): Promise<Assignment[]> {
    const rows = await prisma.assignment.findMany();
    return rows.map(row => new Assignment(row.id, {
      title: row.title,
      instructions: row.instructions || undefined,
      maxScore: row.maxScore,
      dueDate: row.dueDate || undefined,
      rubric: row.rubric || undefined,
      gradingCriteria: row.gradingCriteria || undefined,
      maxAttempts: row.maxAttempts,
      lateSubmissionPolicy: row.lateSubmissionPolicy || undefined,
    }));
  }

  async save(entity: Assignment): Promise<void> {
    await prisma.assignment.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        instructions: entity.instructions,
        maxScore: entity.maxScore,
        dueDate: entity.dueDate,
        rubric: entity.rubric || {},
        gradingCriteria: entity.gradingCriteria || {},
        maxAttempts: entity.maxAttempts,
        lateSubmissionPolicy: entity.lateSubmissionPolicy || {},
      },
      create: {
        id: entity.id,
        title: entity.title,
        instructions: entity.instructions,
        maxScore: entity.maxScore,
        dueDate: entity.dueDate,
        rubric: entity.rubric || {},
        gradingCriteria: entity.gradingCriteria || {},
        maxAttempts: entity.maxAttempts,
        lateSubmissionPolicy: entity.lateSubmissionPolicy || {},
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.assignment.delete({ where: { id } });
  }
}
