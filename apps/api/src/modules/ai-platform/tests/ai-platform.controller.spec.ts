import { Test, TestingModule } from '@nestjs/testing';
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
} from '../presentation/ai-platform-controllers';

describe('AiPlatformControllers', () => {
  let modelGatewayController: ModelGatewayController;
  let promptManagementController: PromptManagementController;
  let knowledgeBaseController: KnowledgeBaseController;
  let agentCoordinatorController: AgentCoordinatorController;
  let copilotController: CopilotController;
  let aiGovernanceController: AiGovernanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    modelGatewayController = module.get<ModelGatewayController>(ModelGatewayController);
    promptManagementController = module.get<PromptManagementController>(PromptManagementController);
    knowledgeBaseController = module.get<KnowledgeBaseController>(KnowledgeBaseController);
    agentCoordinatorController = module.get<AgentCoordinatorController>(AgentCoordinatorController);
    copilotController = module.get<CopilotController>(CopilotController);
    aiGovernanceController = module.get<AiGovernanceController>(AiGovernanceController);
  });

  it('should define all 10 specialized AI platform controllers', () => {
    expect(modelGatewayController).toBeDefined();
    expect(promptManagementController).toBeDefined();
    expect(knowledgeBaseController).toBeDefined();
    expect(agentCoordinatorController).toBeDefined();
    expect(copilotController).toBeDefined();
    expect(aiGovernanceController).toBeDefined();
  });

  it('should define V2 final governance actions', () => {
    expect(aiGovernanceController.registerMcpServer).toBeDefined();
    expect(aiGovernanceController.scheduleJob).toBeDefined();
    expect(aiGovernanceController.evaluateRag).toBeDefined();
    expect(aiGovernanceController.getDashboard).toBeDefined();
    expect(aiGovernanceController.replayEvents).toBeDefined();
    expect(aiGovernanceController.executeSagaWorkflow).toBeDefined();
    expect(aiGovernanceController.registerFeature).toBeDefined();
    expect(aiGovernanceController.shiftTraffic).toBeDefined();
    expect(aiGovernanceController.executeGoldenRun).toBeDefined();
    expect(aiGovernanceController.triggerBackup).toBeDefined();
    expect(aiGovernanceController.runReadinessCheck).toBeDefined();
    expect(aiGovernanceController.injectChaos).toBeDefined();
    expect(aiGovernanceController.runLoadBenchmark).toBeDefined();
  });
});
