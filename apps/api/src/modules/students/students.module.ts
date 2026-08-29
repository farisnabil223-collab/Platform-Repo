import { Module } from '@nestjs/common';
import { StudentsController } from './presentation/students.controller';
import { EnrollStudentHandler } from './application/commands/enroll-student.handler';
import { TransferStudentSectionHandler } from './application/commands/transfer-student-section.handler';
import { LinkGuardianHandler } from './application/commands/link-guardian.handler';
import {
  StudentProfileRepository,
  AcademicYearRepository,
  EnrollmentRepository,
  SectionRepository,
  GuardianRepository
} from '@eduverse/database';

@Module({
  controllers: [StudentsController],
  providers: [
    EnrollStudentHandler,
    TransferStudentSectionHandler,
    LinkGuardianHandler,
    {
      provide: StudentProfileRepository,
      useFactory: () => new StudentProfileRepository(),
    },
    {
      provide: AcademicYearRepository,
      useFactory: () => new AcademicYearRepository(),
    },
    {
      provide: EnrollmentRepository,
      useFactory: () => new EnrollmentRepository(),
    },
    {
      provide: SectionRepository,
      useFactory: () => new SectionRepository(),
    },
    {
      provide: GuardianRepository,
      useFactory: () => new GuardianRepository(),
    },
  ],
  exports: [
    EnrollStudentHandler,
    TransferStudentSectionHandler,
    LinkGuardianHandler,
    StudentProfileRepository,
    AcademicYearRepository,
    EnrollmentRepository,
    SectionRepository,
    GuardianRepository,
  ],
})
export class StudentsModule {}
