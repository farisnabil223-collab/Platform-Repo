import { Module } from '@nestjs/common';
import { TeachersController } from './presentation/teachers.controller';
import { PublicTeachersController } from './presentation/public-teachers.controller';
import { AssignTeacherSubjectHandler } from './application/commands/assign-teacher-subject.handler';
import { TeachersPublicService } from './application/teachers-public.service';
import { ITeachersRepository } from './domain/teachers.repository';
import { PrismaTeachersRepository } from './infrastructure/prisma-teachers.repository';
import { MediaModule } from '../media/media.module';
import { TeacherProfileRepository, SubjectRepository } from '@eduverse/database';

@Module({
  imports: [MediaModule],
  controllers: [
    TeachersController,
    PublicTeachersController,
  ],
  providers: [
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
    AssignTeacherSubjectHandler,
    ITeachersRepository,
    TeachersPublicService,
    TeacherProfileRepository,
    SubjectRepository,
  ],
})
export class TeachersModule {}
