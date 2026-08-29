import { DomainEvent } from './domain-event';

export class PromptExecuted extends DomainEvent {
  constructor(
    public readonly executionId: string,
    public readonly userId: string,
    public readonly modelName: string,
    public readonly latencyMs: number
  ) {
    super(executionId);
  }
}

export class KnowledgeIndexed extends DomainEvent {
  constructor(
    public readonly baseId: string,
    public readonly docName: string,
    public readonly chunkCount: number
  ) {
    super(baseId);
  }
}

export class AgentTaskCompleted extends DomainEvent {
  constructor(
    public readonly taskId: string,
    public readonly agentId: string,
    public readonly taskText: string
  ) {
    super(taskId);
  }
}

export class ToolInvoked extends DomainEvent {
  constructor(
    public readonly toolId: string,
    public readonly executionId: string,
    public readonly toolName: string
  ) {
    super(toolId);
  }
}

export class AiAutomationTriggered extends DomainEvent {
  constructor(
    public readonly triggerId: string,
    public readonly workflowId: string,
    public readonly triggerType: string
  ) {
    super(triggerId);
  }
}

export class InsightGenerated extends DomainEvent {
  constructor(
    public readonly insightId: string,
    public readonly category: string,
    public readonly impactScore: number
  ) {
    super(insightId);
  }
}

export class CostLimitBreached extends DomainEvent {
  constructor(
    public readonly tenantId: string,
    public readonly currentUsageUsd: number,
    public readonly alertThresholdUsd: number
  ) {
    super(tenantId);
  }
}

export class SecurityThreatBlocked extends DomainEvent {
  constructor(
    public readonly tenantId: string,
    public readonly threatType: string,
    public readonly threatDetail: string
  ) {
    super(tenantId);
  }
}

export class ModelStageChanged extends DomainEvent {
  constructor(
    public readonly registryId: string,
    public readonly oldStage: string,
    public readonly newStage: string
  ) {
    super(registryId);
  }
}

export class CheckpointSaved extends DomainEvent {
  constructor(
    public readonly checkpointId: string,
    public readonly contextId: string,
    public readonly stepIndex: number
  ) {
    super(checkpointId);
  }
}

export class PolicyViolated extends DomainEvent {
  constructor(
    public readonly tenantId: string,
    public readonly policyName: string,
    public readonly violatedRule: string
  ) {
    super(tenantId);
  }
}

export class CacheHit extends DomainEvent {
  constructor(
    public readonly entryId: string,
    public readonly cacheType: string,
    public readonly keyHash: string
  ) {
    super(entryId);
  }
}

export class TelemetryRecorded extends DomainEvent {
  constructor(
    public readonly metricId: string,
    public readonly metricType: string,
    public readonly metricValue: number
  ) {
    super(metricId);
  }
}

export class JobScheduled extends DomainEvent {
  constructor(
    public readonly jobId: string,
    public readonly jobType: string
  ) {
    super(jobId);
  }
}

export class McpRegistered extends DomainEvent {
  constructor(
    public readonly registryId: string,
    public readonly serverName: string
  ) {
    super(registryId);
  }
}

export class RetrievalEvaluated extends DomainEvent {
  constructor(
    public readonly evaluationId: string,
    public readonly retrievalId: string,
    public readonly recallScore: number
  ) {
    super(evaluationId);
  }
}


