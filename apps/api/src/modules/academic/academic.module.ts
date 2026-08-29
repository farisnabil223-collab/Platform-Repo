import { Module } from '@nestjs/common';
import { AcademicController } from './presentation/academic.controller';
import { CreateGradeHandler } from './application/commands/create-grade.handler';
import { CreateSubjectHandler } from './application/commands/create-subject.handler';
import { CreateClassroomHandler } from './application/commands/create-classroom.handler';
import { CreateSectionHandler } from './application/commands/create-section.handler';
import { CreateAcademicYearHandler } from './application/commands/create-academic-year.handler';
import { TransitionYearHandler } from './application/commands/transition-year.handler';
import {
  GradeRepository,
  SubjectRepository,
  ClassroomRepository,
  SectionRepository,
  AcademicYearRepository
} from '@eduverse/database';

@Module({
  controllers: [AcademicController],
  providers: [
    CreateGradeHandler,
    CreateSubjectHandler,
    CreateClassroomHandler,
    CreateSectionHandler,
    CreateAcademicYearHandler,
    TransitionYearHandler,
    {
      provide: GradeRepository,
      useFactory: () => new GradeRepository(),
    },
    {
      provide: SubjectRepository,
      useFactory: () => new SubjectRepository(),
    },
    {
      provide: ClassroomRepository,
      useFactory: () => new ClassroomRepository(),
    },
    {
      provide: SectionRepository,
      useFactory: () => new SectionRepository(),
    },
    {
      provide: AcademicYearRepository,
      useFactory: () => new AcademicYearRepository(),
    },
  ],
})
export class AcademicModule {}
