import { Module, forwardRef } from '@nestjs/common';
import { CoursesController } from './presentation/courses.controller';
import { PublicCoursesController } from './presentation/public-courses.controller';
import { StudentCoursesController } from './presentation/student-courses.controller';
import { CreateCourseHandler } from './application/commands/create-course.handler';
import { CreateModuleHandler } from './application/commands/create-module.handler';
import { CreateLessonHandler } from './application/commands/create-lesson.handler';
import { CreateLearningContentHandler } from './application/commands/create-learning-content.handler';
import { PublishCourseHandler } from './application/commands/publish-course.handler';
import { ArchiveCourseHandler } from './application/commands/archive-course.handler';
import { CoursesPublicService } from './application/courses-public.service';
import { ICoursesRepository } from './domain/courses.repository';
import { PrismaCoursesRepository } from './infrastructure/prisma-courses.repository';
import { MediaModule } from '../media/media.module';
import { ReviewsModule } from '../catalog/reviews.module';
import {
  CourseRepository,
  CourseVersionRepository,
  ModuleRepository,
  LessonRepository,
  LearningContentRepository
} from '@eduverse/database';

@Module({
  imports: [
    MediaModule,
    forwardRef(() => ReviewsModule),
  ],
  controllers: [
    CoursesController,
    PublicCoursesController,
    StudentCoursesController,
  ],
  providers: [
    CreateCourseHandler,
    CreateModuleHandler,
    CreateLessonHandler,
    CreateLearningContentHandler,
    PublishCourseHandler,
    ArchiveCourseHandler,
    CoursesPublicService,
    {
      provide: ICoursesRepository,
      useClass: PrismaCoursesRepository,
    },
    {
      provide: CourseRepository,
      useFactory: () => new CourseRepository(),
    },
    {
      provide: CourseVersionRepository,
      useFactory: () => new CourseVersionRepository(),
    },
    {
      provide: ModuleRepository,
      useFactory: () => new ModuleRepository(),
    },
    {
      provide: LessonRepository,
      useFactory: () => new LessonRepository(),
    },
    {
      provide: LearningContentRepository,
      useFactory: () => new LearningContentRepository(),
    },
  ],
  exports: [
    CreateCourseHandler,
    CreateModuleHandler,
    CreateLessonHandler,
    CreateLearningContentHandler,
    PublishCourseHandler,
    ArchiveCourseHandler,
    ICoursesRepository,
    CoursesPublicService,
  ],
})
export class CoursesModule {}
