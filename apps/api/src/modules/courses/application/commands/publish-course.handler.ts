import { Injectable, BadRequestException } from '@nestjs/common';
import { CourseRepository, CourseVersionRepository, prisma } from '@eduverse/database';
import {
  CourseVersion,
  VersionNumber,
  generateUuidV7,
  CoursePublishedEvent,
  DomainEventBus
} from '@eduverse/kernel';
import { WorkflowEngine } from '@eduverse/workflow';

@Injectable()
export class PublishCourseHandler {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly versionRepository: CourseVersionRepository
  ) {}

  async execute(courseId: string, semver: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    // Workflow guard validation
    WorkflowEngine.validateCourseTransition(course.status, 'PUBLISHED');

    // 1. Validate modules structure
    const dbModules = await prisma.module.findMany({
      where: { courseId, deletedAt: null },
      include: {
        lessons: {
          where: { deletedAt: null },
          include: {
            contents: {
              include: {
                versions: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
    });

    if (dbModules.length === 0) {
      throw new BadRequestException('Publish failed: Course must contain at least one module.');
    }

    // 2. Validate lessons and polymorphic content
    for (const mod of dbModules) {
      if (mod.lessons.length === 0) {
        throw new BadRequestException(`Publish failed: Module "${mod.title}" must contain at least one lesson.`);
      }
      for (const les of mod.lessons) {
        if (les.contents.length === 0) {
          throw new BadRequestException(`Publish failed: Lesson "${les.title}" must contain at least one content item.`);
        }

        // 3. Validate media asset state if content is a VIDEO
        for (const cnt of les.contents) {
          if (cnt.contentType === 'VIDEO') {
            const activeVer = cnt.versions[0];
            const payload = activeVer?.payload as any;
            const mediaAssetId = payload?.mediaAssetId;

            if (mediaAssetId) {
              const media = await prisma.mediaAsset.findUnique({
                where: { id: mediaAssetId },
              });
              if (!media || media.status !== 'READY') {
                throw new BadRequestException(
                  `Publish failed: Video asset for content "${cnt.title}" is not in READY state.`
                );
              }
            }
          }
        }
      }
    }

    // 4. Freeze structure snapshot (json serialization)
    const structure = dbModules.map(m => ({
      id: m.id,
      title: m.title,
      code: m.code,
      sortOrder: m.sortOrder,
      lessons: m.lessons.map(l => ({
        id: l.id,
        title: l.title,
        code: l.code,
        sortOrder: l.sortOrder,
        displayOrder: l.displayOrder,
        estimatedDuration: l.estimatedDuration,
        isLocked: l.isLocked,
        unlockCondition: l.unlockCondition,
        contents: l.contents.map(c => ({
          id: c.id,
          title: c.title,
          contentType: c.contentType,
          sortOrder: c.sortOrder,
          quizId: c.quizId,
          assignmentId: c.assignmentId,
        })),
      })),
    }));

    // 5. Create CourseVersion
    const versionId = generateUuidV7();
    const courseVersion = new CourseVersion(versionId, {
      courseId,
      semver: new VersionNumber(semver),
      structure,
      isActive: true,
    });
    await this.versionRepository.save(courseVersion);

    // 6. Generate Search Metadata in Catalog
    const category = await prisma.category.findFirst();
    const categoryId = category?.id || generateUuidV7();
    if (!category) {
      // Seed fallback category
      await prisma.category.create({
        data: {
          id: categoryId,
          name: 'General Education',
          slug: 'general-education',
        },
      });
    }

    await prisma.catalogCourse.upsert({
      where: { courseId },
      update: {
        category: 'General',
        difficulty: 'BEGINNER',
        language: 'en',
        estimatedMinutes: 120,
        categoryId,
      },
      create: {
        courseId,
        category: 'General',
        difficulty: 'BEGINNER',
        language: 'en',
        estimatedMinutes: 120,
        categoryId,
      },
    });

    // 7. Update course details & publish event
    course.setCurrentVersion(versionId);
    course.transitionTo('PUBLISHED');
    await this.courseRepository.save(course);

    // Publish event
    await DomainEventBus.getInstance().publish(
      new CoursePublishedEvent(course.id, versionId, semver)
    );
  }
}
