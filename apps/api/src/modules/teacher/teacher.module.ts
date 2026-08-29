import { Module } from '@nestjs/common';
import { InstructorStudioController } from './presentation/instructor-studio.controller';
import { AdminContentController } from './presentation/admin-content.controller';
import { CourseDuplicationEngine } from './application/course-duplication.engine';
import { MediaLibraryService } from './application/media-library.service';
import { PublishingWorkflowService } from './application/publishing-workflow.service';
import { EditingLockService } from './domain/editing-lock.service';
import { ContentDependencyEngine } from './domain/content-dependency.engine';
import { ContentQualityService } from './domain/content-quality.service';

import { MediaModule } from '../media/media.module';
import { TeachersController } from '../teachers/presentation/teachers.controller';
import { PublicTeachersController } from '../teachers/presentation/public-teachers.controller';
import { AssignTeacherSubjectHandler } from '../teachers/application/commands/assign-teacher-subject.handler';
import { TeachersPublicService } from '../teachers/application/teachers-public.service';
import { ITeachersRepository } from '../teachers/domain/teachers.repository';
import { PrismaTeachersRepository } from '../teachers/infrastructure/prisma-teachers.repository';
import { TeacherProfileRepository, SubjectRepository } from '@eduverse/database';

@Module({
  imports: [MediaModule],
  controllers: [
    InstructorStudioController,
    AdminContentController,
    TeachersController,
    PublicTeachersController,
  ],
  providers: [
    CourseDuplicationEngine,
    MediaLibraryService,
    PublishingWorkflowService,
    EditingLockService,
    ContentDependencyEngine,
    ContentQualityService,
    AssignTeacherSubjectHandler,
    TeachersPublicService,
    {
      provide: ITeachersRepository,
      useClass: PrismaTeachersRepository,
    },
    {
      provide: TeacherProfileRepository,
      useFactory: () => new TeacherProfileRepository(),
    },
    {
      provide: SubjectRepository,
      useFactory: () => new SubjectRepository(),
    },
  ],
  exports: [
    CourseDuplicationEngine,
    MediaLibraryService,
    PublishingWorkflowService,
    EditingLockService,
    AssignTeacherSubjectHandler,
    ITeachersRepository,
    TeachersPublicService,
    TeacherProfileRepository,
    SubjectRepository,
  ],
})
export class TeacherModule {}
