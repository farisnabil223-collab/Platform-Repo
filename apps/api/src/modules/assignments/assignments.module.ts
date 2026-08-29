import { Module } from '@nestjs/common';
import { AssignmentsController } from './presentation/assignments.controller';
import { CreateAssignmentHandler } from './application/commands/create-assignment.handler';
import { SubmitAssignmentHandler } from './application/commands/submit-assignment.handler';
import { GradeAssignmentHandler } from './application/commands/grade-assignment.handler';
import { AssignmentRepository } from '@eduverse/database';

@Module({
  controllers: [AssignmentsController],
  providers: [
    CreateAssignmentHandler,
    SubmitAssignmentHandler,
    GradeAssignmentHandler,
    {
      provide: AssignmentRepository,
      useFactory: () => new AssignmentRepository(),
    },
  ],
  exports: [
    CreateAssignmentHandler,
    SubmitAssignmentHandler,
    GradeAssignmentHandler,
  ],
})
export class AssignmentsModule {}
