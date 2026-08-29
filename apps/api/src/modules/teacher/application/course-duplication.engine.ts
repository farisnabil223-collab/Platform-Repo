import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class CourseDuplicationEngine {
  async cloneCourse(courseId: string, newTitle: string) {
    const originalCourse = await prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    const newCourseId = generateUuidV7();
    const newCourseCode = 'CL-' + Math.floor(1000 + Math.random() * 9000);
    const newSlug = newTitle.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(2, 5);

    // 1. Create duplicate course root
    const clonedCourse = await prisma.course.create({
      data: {
        id: newCourseId,
        code: newCourseCode,
        slug: newSlug,
        title: newTitle,
        description: originalCourse.description,
        status: 'DRAFT',
        teacherId: originalCourse.teacherId,
      },
    });

    // 2. Clone sections (modules) and lessons
    for (const mod of originalCourse.modules) {
      const newModuleId = generateUuidV7();
      const newModuleCode = 'MOD-' + Math.floor(1000 + Math.random() * 9000);
      await prisma.module.create({
        data: {
          id: newModuleId,
          courseId: newCourseId,
          code: newModuleCode,
          title: mod.title,
          sortOrder: mod.sortOrder,
        },
      });

      for (const les of mod.lessons) {
        const newLessonId = generateUuidV7();
        const newLessonCode = 'LES-' + Math.floor(10000 + Math.random() * 90000);
        await prisma.lesson.create({
          data: {
            id: newLessonId,
            moduleId: newModuleId,
            code: newLessonCode,
            title: les.title,
            sortOrder: les.sortOrder,
            estimatedDuration: les.estimatedDuration,
          },
        });
      }
    }

    return clonedCourse;
  }
}
