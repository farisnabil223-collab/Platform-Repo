import { Module } from '@nestjs/common';
import { StudentAssessmentController } from './presentation/student-assessment.controller';
import { AdminAssessmentController } from './presentation/admin-assessment.controller';
import { ExamRuntimeController } from './presentation/exam-runtime.controller';
import { IntegrityController } from './presentation/integrity.controller';
import { CertificatesController } from './presentation/certificates.controller';
import { AnalyticsController } from './presentation/analytics.controller';
import { AssessmentAttemptService } from './application/assessment-attempt.service';
import { AssessmentScoringPipeline } from './application/assessment-scoring.pipeline';
import { GradebookService } from './application/gradebook.service';
import { ExamEngineService } from './application/exam-engine.service';
import { IntegrityService } from './application/integrity.service';
import { CertificationService } from './application/certification.service';
import { AssessmentAnalyticsService } from './application/assessment-analytics.service';
import { AnswerValidationService } from './domain/answer-validation.service';
import { IFileStorageProvider } from './domain/file-storage.provider.interface';
import { LocalFileStorageProvider } from './provider/local-file-storage.provider';

import { AssessmentsController } from '../assessments/presentation/assessments.controller';
import { CreateAssessmentHandler } from '../assessments/application/commands/create-assessment.handler';
import { StartAttemptHandler } from '../assessments/application/commands/start-attempt.handler';
import { SaveAnswerHandler } from '../assessments/application/commands/save-answer.handler';
import { SubmitAttemptHandler } from '../assessments/application/commands/submit-attempt.handler';
import { GradeReviewHandler } from '../assessments/application/commands/grade-review.handler';
import { CreateAppealHandler } from '../assessments/application/commands/create-appeal.handler';
import {
  AssessmentRepository,
  AssessmentAttemptRepository,
  QuestionRepository,
  QuestionBankRepository,
  AssessmentResultRepository
} from '@eduverse/database';

@Module({
  controllers: [
    StudentAssessmentController,
    AdminAssessmentController,
    ExamRuntimeController,
    IntegrityController,
    CertificatesController,
    AnalyticsController,
    AssessmentsController,
  ],
  providers: [
    AssessmentAttemptService,
    AssessmentScoringPipeline,
    GradebookService,
    ExamEngineService,
    IntegrityService,
    CertificationService,
    AssessmentAnalyticsService,
    AnswerValidationService,
    {
      provide: IFileStorageProvider,
      useClass: LocalFileStorageProvider,
    },
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
    AssessmentAttemptService,
    AssessmentScoringPipeline,
    GradebookService,
    ExamEngineService,
    IntegrityService,
    CertificationService,
    AssessmentAnalyticsService,
    CreateAssessmentHandler,
    StartAttemptHandler,
    SaveAnswerHandler,
    SubmitAttemptHandler,
    GradeReviewHandler,
    CreateAppealHandler,
  ],
})
export class AssessmentModule {}
