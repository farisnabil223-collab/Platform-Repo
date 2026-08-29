import { Module } from '@nestjs/common';
import { ParentController } from './presentation/parent.controller';
import { StudentSuccessController } from './presentation/student-success.controller';
import { StudentRiskController } from './presentation/student-risk.controller';
import { StudentCasesController } from './presentation/student-cases.controller';
import { ParentService } from './application/parent.service';
import { CaseManagementService } from './application/case-management.service';
import { MeetingWorkflowService } from './application/meeting-workflow.service';
import { StudentRiskEngine } from './domain/student-risk.engine';
import { StudentRecommendationEngine } from './domain/student-recommendation.engine';
import { AIModule } from '../ai/ai.module';
import { AiScoringProvidersService } from './domain/ai-scoring-providers.service';
import { IRiskScoringProvider, ISuccessScoringProvider, IRecommendationProvider } from './domain/scoring-providers.interface';

@Module({
  imports: [AIModule],
  controllers: [
    ParentController,
    StudentSuccessController,
    StudentRiskController,
    StudentCasesController,
  ],
  providers: [
    ParentService,
    CaseManagementService,
    MeetingWorkflowService,
    StudentRiskEngine,
    StudentRecommendationEngine,
    AiScoringProvidersService,
    {
      provide: IRiskScoringProvider,
      useClass: AiScoringProvidersService,
    },
    {
      provide: ISuccessScoringProvider,
      useClass: AiScoringProvidersService,
    },
    {
      provide: IRecommendationProvider,
      useClass: AiScoringProvidersService,
    },
  ],
  exports: [
    ParentService,
    CaseManagementService,
    MeetingWorkflowService,
    StudentRiskEngine,
    StudentRecommendationEngine,
    IRiskScoringProvider,
    ISuccessScoringProvider,
    IRecommendationProvider,
  ],
})
export class ParentModule {}
