import { Module } from '@nestjs/common';
import {
  ModelGatewayController,
  PromptManagementController,
  KnowledgeBaseController,
  RagEngineController,
  AgentCoordinatorController,
  AgentToolController,
  CopilotController,
  AutonomousOpsController,
  AiWorkflowController,
  AiGovernanceController
} from './presentation/ai-platform-controllers';

@Module({
  controllers: [
    ModelGatewayController,
    PromptManagementController,
    KnowledgeBaseController,
    RagEngineController,
    AgentCoordinatorController,
    AgentToolController,
    CopilotController,
    AutonomousOpsController,
    AiWorkflowController,
    AiGovernanceController,
  ],
  providers: [],
  exports: [],
})
export class AiPlatformModule {}
