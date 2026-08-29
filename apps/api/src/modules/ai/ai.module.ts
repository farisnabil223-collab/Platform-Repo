import { Module } from '@nestjs/common';
import { IAIProvider, IChatProvider, IEmbeddingProvider, IContentGenerationProvider, IVisionProvider, ITranscriptionProvider } from './domain/ai-providers.interface';
import { MockAiProviderService } from './infrastructure/mock-ai-providers.service';
import { AiController } from './presentation/ai.controller';
import { AIOrchestrator } from './domain/ai-orchestrator.service';
import { PromptManagementService } from './application/prompt-management.service';
import { AISafetyGuardrails } from './domain/ai-safety-guardrails.service';
import { AIBudgetManager } from './application/ai-budget-manager.service';
import { IVectorStore } from './domain/vector-store.interface';
import { MockVectorStoreService } from './infrastructure/mock-vector-store.service';
import { ToolRegistry, ToolExecutor } from './domain/ai-tool-calling.interface';
import { MockToolCallingService } from './infrastructure/mock-tool-calling.service';

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
} from '../ai-platform/presentation/ai-platform-controllers';

@Module({
  controllers: [
    AiController,
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
  providers: [
    {
      provide: IAIProvider,
      useClass: MockAiProviderService,
    },
    {
      provide: IChatProvider,
      useClass: MockAiProviderService,
    },
    {
      provide: IEmbeddingProvider,
      useClass: MockAiProviderService,
    },
    {
      provide: IContentGenerationProvider,
      useClass: MockAiProviderService,
    },
    {
      provide: IVisionProvider,
      useClass: MockAiProviderService,
    },
    {
      provide: ITranscriptionProvider,
      useClass: MockAiProviderService,
    },
    AIOrchestrator,
    PromptManagementService,
    AISafetyGuardrails,
    AIBudgetManager,
    {
      provide: IVectorStore,
      useClass: MockVectorStoreService,
    },
    {
      provide: ToolRegistry,
      useClass: MockToolCallingService,
    },
    {
      provide: ToolExecutor,
      useClass: MockToolCallingService,
    },
  ],
  exports: [
    IAIProvider,
    IChatProvider,
    IEmbeddingProvider,
    IContentGenerationProvider,
    IVisionProvider,
    ITranscriptionProvider,
    AIOrchestrator,
    PromptManagementService,
    AISafetyGuardrails,
    AIBudgetManager,
    IVectorStore,
    ToolRegistry,
    ToolExecutor,
  ],
})
export class AIModule {}
