import { Module } from '@nestjs/common';
import { AssessmentsController } from './presentation/assessments.controller';
import { CreateAssessmentHandler } from './application/commands/create-assessment.handler';
import { StartAttemptHandler } from './application/commands/start-attempt.handler';
import { SaveAnswerHandler } from './application/commands/save-answer.handler';
import { SubmitAttemptHandler } from './application/commands/submit-attempt.handler';
import { GradeReviewHandler } from './application/commands/grade-review.handler';
import { CreateAppealHandler } from './application/commands/create-appeal.handler';
import {
  AssessmentRepository,
  AssessmentAttemptRepository,
  QuestionRepository,
  QuestionBankRepository,
  AssessmentResultRepository
} from '@eduverse/database';

@Module({
  controllers: [AssessmentsController],
  providers: [
    CreateAssessmentHandler,
    StartAttemptHandler,
    SaveAnswerHandler,
    SubmitAttemptHandler,
    GradeReviewHandler,
    CreateAppealHandler,
    {
      provide: AssessmentRepository,
      useFactory: () => new AssessmentRepository(),
    },
    {
      provide: AssessmentAttemptRepository,
      useFactory: () => new AssessmentAttemptRepository(),
    },
    {
      provide: QuestionRepository,
      useFactory: () => new QuestionRepository(),
    },
    {
      provide: QuestionBankRepository,
      useFactory: () => new QuestionBankRepository(),
    },
    {
      provide: AssessmentResultRepository,
      useFactory: () => new AssessmentResultRepository(),
    },
  ],
  exports: [
    CreateAssessmentHandler,
    StartAttemptHandler,
    SaveAnswerHandler,
    SubmitAttemptHandler,
    GradeReviewHandler,
    CreateAppealHandler,
  ],
})
export class AssessmentsModule {}
