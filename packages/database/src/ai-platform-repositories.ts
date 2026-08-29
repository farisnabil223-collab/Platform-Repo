import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  AiModel,
  AiProvider,
  AiConversation,
  AiConversationMessage,
  AiPromptTemplate,
  AiPromptVersion,
  AiPromptExecution,
  AiKnowledgeBase,
  KnowledgeDocument,
  AiKnowledgeChunk,
  EmbeddingVector,
  VectorIndex,
  RetrievalSession,
  RetrievalResult,
  AiAgent,
  AgentCapability,
  AgentExecution,
  AgentMemory,
  AgentGoal,
  AgentTask,
  AgentTool,
  ToolExecution,
  WorkflowAutomation,
  AutomationTrigger,
  AutomationExecution,
  AiRecommendation,
  AiInsight,
  AiDecision,
  AiEvaluation,
  AiFeedback,
  AiAuditLog,
  AiUsageMetric,
  AiCostMetric,
  AiQuota,
  ModelRouter,
  RoutingPolicy,
  RoutingRule,
  ModelCapability,
  ModelAvailability,
  ModelLatencyProfile,
  ModelHealthStatus,
  AiModelRegistry,
  AiModelVersion,
  AiModelEvaluationHistory,
  PromptCollection,
  PromptComponent,
  EmbeddingModelRegistry,
  AgentExecutionContext,
  AgentExecutionCheckpoint,
  AgentPermission,
  ToolRegistry,
  AiCacheEntry,
  AiExperiment,
  AiDataset,
  FineTuningJob,
  AiPolicy,
  AiTelemetryMetric,
  ReasoningTrace,
  AiPlatformJob,
  McpServerRegistry,
  AiMarketplaceExtension,
  RetrievalEvaluationMetric,
  AiEventStore,
  AiFeatureStore,
  AiModelDeployment,
  AiEvaluationReport,
  AiPlatformBudget,
  AiEncryptedSecret,
  AiDisasterBackup,
  AiVectorSyncJob
} from '@eduverse/kernel';

export class AiModelRepository extends BaseTenantRepository {
  async save(model: AiModel): Promise<void> {
    await prisma.aiModel.upsert({
      where: { id: model.id },
      update: { isDefault: model.isDefault },
      create: {
        id: model.id,
        tenantId: this.getTenantIdOrThrow(),
        modelName: model.modelName,
        modelType: model.modelType,
        maxTokens: model.maxTokens,
        contextWindow: model.contextWindow,
        isDefault: model.isDefault,
      },
    });
  }
}

export class AiProviderRepository extends BaseTenantRepository {
  async save(provider: AiProvider): Promise<void> {
    await prisma.aiProvider.upsert({
      where: { id: provider.id },
      update: { isProviderActive: provider.isProviderActive, credentialsJson: provider.credentialsJson },
      create: {
        id: provider.id,
        tenantId: this.getTenantIdOrThrow(),
        providerName: provider.providerName,
        apiEndpoint: provider.apiEndpoint,
        isProviderActive: provider.isProviderActive,
        credentialsJson: provider.credentialsJson,
      },
    });
  }
}

export class AiConversationRepository extends BaseTenantRepository {
  async save(conv: AiConversation): Promise<void> {
    await prisma.aiConversation.upsert({
      where: { id: conv.id },
      update: { isArchived: conv.isArchived, title: conv.title, metaJson: conv.metaJson },
      create: {
        id: conv.id,
        tenantId: this.getTenantIdOrThrow(),
        title: conv.title,
        userId: conv.userId,
        metaJson: conv.metaJson,
        isArchived: conv.isArchived,
      },
    });
  }
}

export class AiConversationMessageRepository extends BaseTenantRepository {
  async save(msg: AiConversationMessage): Promise<void> {
    await prisma.aiConversationMessage.create({
      data: {
        id: msg.id,
        tenantId: this.getTenantIdOrThrow(),
        conversationId: msg.conversationId,
        senderType: msg.senderType,
        content: msg.content,
        tokensUsed: msg.tokensUsed,
      },
    });
  }
}

export class AiPromptTemplateRepository extends BaseTenantRepository {
  async save(tmpl: AiPromptTemplate): Promise<void> {
    await prisma.aiPromptTemplate.upsert({
      where: { id: tmpl.id },
      update: { isDefault: tmpl.isDefault, description: tmpl.description },
      create: {
        id: tmpl.id,
        tenantId: this.getTenantIdOrThrow(),
        name: tmpl.name,
        description: tmpl.description,
        category: tmpl.category,
        isDefault: tmpl.isDefault,
      },
    });
  }
}

export class AiPromptVersionRepository extends BaseTenantRepository {
  async save(ver: AiPromptVersion): Promise<void> {
    await prisma.aiPromptVersion.create({
      data: {
        id: ver.id,
        tenantId: this.getTenantIdOrThrow(),
        templateId: ver.templateId,
        versionNumber: ver.versionNumber,
        promptText: ver.promptText,
        approvedByEmail: ver.approvedByEmail,
      },
    });
  }
}

export class AiPromptExecutionRepository extends BaseTenantRepository {
  async save(exec: AiPromptExecution): Promise<void> {
    await prisma.aiPromptExecution.create({
      data: {
        id: exec.id,
        tenantId: this.getTenantIdOrThrow(),
        versionId: exec.versionId,
        userId: exec.userId,
        inputsJson: exec.inputsJson,
        outputText: exec.outputText,
        latencyMs: exec.latencyMs,
        cost: exec.cost,
      },
    });
  }
}

export class AiKnowledgeBaseRepository extends BaseTenantRepository {
  async save(kb: AiKnowledgeBase): Promise<void> {
    await prisma.aiKnowledgeBase.upsert({
      where: { id: kb.id },
      update: { isVectorSyncActive: kb.isVectorSyncActive, description: kb.description },
      create: {
        id: kb.id,
        tenantId: this.getTenantIdOrThrow(),
        name: kb.name,
        description: kb.description,
        isVectorSyncActive: kb.isVectorSyncActive,
      },
    });
  }
}

export class KnowledgeDocumentRepository extends BaseTenantRepository {
  async save(doc: KnowledgeDocument): Promise<void> {
    await prisma.knowledgeDocument.create({
      data: {
        id: doc.id,
        tenantId: this.getTenantIdOrThrow(),
        knowledgeBaseId: doc.knowledgeBaseId,
        docName: doc.docName,
        storageUrl: doc.storageUrl,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
      },
    });
  }
}

export class AiKnowledgeChunkRepository extends BaseTenantRepository {
  async save(chunk: AiKnowledgeChunk): Promise<void> {
    await prisma.aiKnowledgeChunk.create({
      data: {
        id: chunk.id,
        tenantId: this.getTenantIdOrThrow(),
        documentId: chunk.documentId,
        contentText: chunk.contentText,
        tokenLength: chunk.tokenLength,
        chunkIndex: chunk.chunkIndex,
      },
    });
  }
}

export class EmbeddingVectorRepository extends BaseTenantRepository {
  async save(vec: EmbeddingVector): Promise<void> {
    await prisma.embeddingVector.create({
      data: {
        id: vec.id,
        tenantId: this.getTenantIdOrThrow(),
        chunkId: vec.chunkId,
        vectorValuesJson: vec.vectorValuesJson,
        modelUsed: vec.modelUsed,
      },
    });
  }
}

export class VectorIndexRepository extends BaseTenantRepository {
  async save(idx: VectorIndex): Promise<void> {
    await prisma.vectorIndex.upsert({
      where: { id: idx.id },
      update: { lastBuiltAt: idx.lastBuiltAt },
      create: {
        id: idx.id,
        tenantId: this.getTenantIdOrThrow(),
        indexName: idx.indexName,
        dimensions: idx.dimensions,
        distanceMetric: idx.distanceMetric,
        lastBuiltAt: idx.lastBuiltAt,
      },
    });
  }
}

export class RetrievalSessionRepository extends BaseTenantRepository {
  async save(sess: RetrievalSession): Promise<void> {
    await prisma.retrievalSession.create({
      data: {
        id: sess.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: sess.userId,
        queryText: sess.queryText,
        retrievalParametersJson: sess.retrievalParametersJson,
      },
    });
  }
}

export class RetrievalResultRepository extends BaseTenantRepository {
  async save(res: RetrievalResult): Promise<void> {
    await prisma.retrievalResult.create({
      data: {
        id: res.id,
        tenantId: this.getTenantIdOrThrow(),
        sessionId: res.sessionId,
        chunkId: res.chunkId,
        score: res.score,
        relevanceRank: res.relevanceRank,
      },
    });
  }
}

export class AiAgentRepository extends BaseTenantRepository {
  async save(agent: AiAgent): Promise<void> {
    await prisma.aiAgent.upsert({
      where: { id: agent.id },
      update: { systemPrompt: agent.systemPrompt, temperature: agent.temperature },
      create: {
        id: agent.id,
        tenantId: this.getTenantIdOrThrow(),
        agentName: agent.agentName,
        agentRole: agent.agentRole,
        temperature: agent.temperature,
        systemPrompt: agent.systemPrompt,
      },
    });
  }
}

export class AgentCapabilityRepository extends BaseTenantRepository {
  async save(cap: AgentCapability): Promise<void> {
    await prisma.agentCapability.upsert({
      where: { id: cap.id },
      update: { isEnabled: cap.isEnabled },
      create: {
        id: cap.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: cap.agentId,
        capabilityName: cap.capabilityName,
        isEnabled: cap.isEnabled,
      },
    });
  }
}

export class AgentExecutionRepository extends BaseTenantRepository {
  async save(exec: AgentExecution): Promise<void> {
    await prisma.agentExecution.upsert({
      where: { id: exec.id },
      update: { status: exec.status, errorMessage: exec.errorMessage, completedAt: exec.completedAt },
      create: {
        id: exec.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: exec.agentId,
        status: exec.status,
        errorMessage: exec.errorMessage,
        startedAt: exec.startedAt,
        completedAt: exec.completedAt,
      },
    });
  }
}

export class AgentMemoryRepository extends BaseTenantRepository {
  async save(mem: AgentMemory): Promise<void> {
    await prisma.agentMemory.create({
      data: {
        id: mem.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: mem.agentId,
        memoryKey: mem.memoryKey,
        memoryValue: mem.memoryValue,
        contextType: mem.contextType,
      },
    });
  }
}

export class AgentGoalRepository extends BaseTenantRepository {
  async save(goal: AgentGoal): Promise<void> {
    await prisma.agentGoal.upsert({
      where: { id: goal.id },
      update: { isAchieved: goal.isAchieved, priority: goal.priority },
      create: {
        id: goal.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: goal.agentId,
        goalText: goal.goalText,
        isAchieved: goal.isAchieved,
        priority: goal.priority,
      },
    });
  }
}

export class AgentTaskRepository extends BaseTenantRepository {
  async save(task: AgentTask): Promise<void> {
    await prisma.agentTask.upsert({
      where: { id: task.id },
      update: { status: task.status },
      create: {
        id: task.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: task.agentId,
        taskText: task.taskText,
        status: task.status,
        dependencyTaskId: task.dependencyTaskId,
      },
    });
  }
}

export class AgentToolRepository extends BaseTenantRepository {
  async save(tool: AgentTool): Promise<void> {
    await prisma.agentTool.upsert({
      where: { id: tool.id },
      update: { description: tool.description, isUserApprovedRequired: tool.isUserApprovedRequired },
      create: {
        id: tool.id,
        tenantId: this.getTenantIdOrThrow(),
        toolName: tool.toolName,
        description: tool.description,
        parametersSchemaJson: tool.parametersSchemaJson,
        isUserApprovedRequired: tool.isUserApprovedRequired,
      },
    });
  }
}

export class ToolExecutionRepository extends BaseTenantRepository {
  async save(exec: ToolExecution): Promise<void> {
    await prisma.toolExecution.create({
      data: {
        id: exec.id,
        tenantId: this.getTenantIdOrThrow(),
        agentExecutionId: exec.agentExecutionId,
        toolId: exec.toolId,
        inputsJson: exec.inputsJson,
        outputsJson: exec.outputsJson,
        durationMs: exec.durationMs,
      },
    });
  }
}

export class WorkflowAutomationRepository extends BaseTenantRepository {
  async save(auto: WorkflowAutomation): Promise<void> {
    await prisma.workflowAutomation.upsert({
      where: { id: auto.id },
      update: { isAutomationEnabled: auto.isAutomationEnabled, description: auto.description },
      create: {
        id: auto.id,
        tenantId: this.getTenantIdOrThrow(),
        name: auto.name,
        description: auto.description,
        isAutomationEnabled: auto.isAutomationEnabled,
      },
    });
  }
}

export class AutomationTriggerRepository extends BaseTenantRepository {
  async save(trig: AutomationTrigger): Promise<void> {
    await prisma.automationTrigger.create({
      data: {
        id: trig.id,
        tenantId: this.getTenantIdOrThrow(),
        workflowId: trig.workflowId,
        triggerType: trig.triggerType,
        conditionsJson: trig.conditionsJson,
      },
    });
  }
}

export class AutomationExecutionRepository extends BaseTenantRepository {
  async save(exec: AutomationExecution): Promise<void> {
    await prisma.automationExecution.create({
      data: {
        id: exec.id,
        tenantId: this.getTenantIdOrThrow(),
        workflowId: exec.workflowId,
        status: exec.status,
        logsText: exec.logsText,
        durationMs: exec.durationMs,
      },
    });
  }
}

export class AiRecommendationRepository extends BaseTenantRepository {
  async save(rec: AiRecommendation): Promise<void> {
    await prisma.aiRecommendation.create({
      data: {
        id: rec.id,
        tenantId: this.getTenantIdOrThrow(),
        targetType: rec.targetType,
        targetId: rec.targetId,
        recommendationText: rec.recommendationText,
        confidenceScore: rec.confidenceScore,
      },
    });
  }
}

export class AiInsightRepository extends BaseTenantRepository {
  async save(ins: AiInsight): Promise<void> {
    await prisma.aiInsight.create({
      data: {
        id: ins.id,
        tenantId: this.getTenantIdOrThrow(),
        category: ins.category,
        insightText: ins.insightText,
        impactScore: ins.impactScore,
        relevanceTagsJson: ins.relevanceTagsJson,
      },
    });
  }
}

export class AiDecisionRepository extends BaseTenantRepository {
  async save(dec: AiDecision): Promise<void> {
    await prisma.aiDecision.create({
      data: {
        id: dec.id,
        tenantId: this.getTenantIdOrThrow(),
        insightId: dec.insightId,
        actionTaken: dec.actionTaken,
        executedByEmail: dec.executedByEmail,
        status: dec.status,
      },
    });
  }
}

export class AiEvaluationRepository extends BaseTenantRepository {
  async save(evals: AiEvaluation): Promise<void> {
    await prisma.aiEvaluation.create({
      data: {
        id: evals.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: evals.modelId,
        promptVersionId: evals.promptVersionId,
        rating: evals.rating,
        feedbackText: evals.feedbackText,
      },
    });
  }
}

export class AiFeedbackRepository extends BaseTenantRepository {
  async save(fb: AiFeedback): Promise<void> {
    await prisma.aiFeedback.create({
      data: {
        id: fb.id,
        tenantId: this.getTenantIdOrThrow(),
        conversationId: fb.conversationId,
        messageIndex: fb.messageIndex,
        isThumbsUp: fb.isThumbsUp,
        comments: fb.comments,
      },
    });
  }
}

export class AiAuditLogRepository extends BaseTenantRepository {
  async save(log: AiAuditLog): Promise<void> {
    await prisma.aiAuditLog.create({
      data: {
        id: log.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: log.userId,
        action: log.action,
        modelId: log.modelId,
        inputLength: log.inputLength,
        outputLength: log.outputLength,
      },
    });
  }
}

export class AiUsageMetricRepository extends BaseTenantRepository {
  async save(metric: AiUsageMetric): Promise<void> {
    await prisma.aiUsageMetric.create({
      data: {
        id: metric.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: metric.modelId,
        promptsCount: metric.promptsCount,
        messagesCount: metric.messagesCount,
        totalTokensUsed: metric.totalTokensUsed,
      },
    });
  }
}

export class AiCostMetricRepository extends BaseTenantRepository {
  async save(cost: AiCostMetric): Promise<void> {
    await prisma.aiCostMetric.create({
      data: {
        id: cost.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: cost.modelId,
        modelCostInUsd: cost.modelCostInUsd,
        costLimitAlertThreshold: cost.costLimitAlertThreshold,
      },
    });
  }
}

export class AiQuotaRepository extends BaseTenantRepository {
  async save(quota: AiQuota): Promise<void> {
    await prisma.aiQuota.upsert({
      where: { id: quota.id },
      update: { currentTokenUsage: quota.currentTokenUsage },
      create: {
        id: quota.id,
        tenantId: this.getTenantIdOrThrow(),
        monthlyTokenLimit: quota.monthlyTokenLimit,
        currentTokenUsage: quota.currentTokenUsage,
        resetAt: quota.resetAt,
      },
    });
  }
}

export class ModelRouterRepository extends BaseTenantRepository {
  async save(router: ModelRouter): Promise<void> {
    await prisma.modelRouter.upsert({
      where: { id: router.id },
      update: { isEnabled: router.isEnabled },
      create: {
        id: router.id,
        tenantId: this.getTenantIdOrThrow(),
        routerName: router.routerName,
        routingStrategy: router.routingStrategy,
        isEnabled: router.isEnabled,
      },
    });
  }
}

export class RoutingPolicyRepository extends BaseTenantRepository {
  async save(pol: RoutingPolicy): Promise<void> {
    await prisma.routingPolicy.upsert({
      where: { id: pol.id },
      update: { maxCostLimit: pol.maxCostLimit },
      create: {
        id: pol.id,
        tenantId: this.getTenantIdOrThrow(),
        routerId: pol.routerId,
        policyName: pol.policyName,
        minLatencyMs: pol.minLatencyMs,
        maxCostLimit: pol.maxCostLimit,
      },
    });
  }
}

export class RoutingRuleRepository extends BaseTenantRepository {
  async save(rule: RoutingRule): Promise<void> {
    await prisma.routingRule.create({
      data: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        policyId: rule.policyId,
        ruleCondition: rule.ruleCondition,
        targetModelId: rule.targetModelId,
        priority: rule.priority,
      },
    });
  }
}

export class ModelCapabilityRepository extends BaseTenantRepository {
  async save(cap: ModelCapability): Promise<void> {
    await prisma.modelCapability.upsert({
      where: { id: cap.id },
      update: { isSupported: cap.isSupported },
      create: {
        id: cap.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: cap.modelId,
        capabilityName: cap.capabilityName,
        isSupported: cap.isSupported,
      },
    });
  }
}

export class ModelAvailabilityRepository extends BaseTenantRepository {
  async save(av: ModelAvailability): Promise<void> {
    await prisma.modelAvailability.upsert({
      where: { id: av.id },
      update: { isOnline: av.isOnline, lastCheckedAt: av.lastCheckedAt },
      create: {
        id: av.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: av.modelId,
        provider: av.provider,
        isOnline: av.isOnline,
        lastCheckedAt: av.lastCheckedAt,
      },
    });
  }
}

export class ModelLatencyProfileRepository extends BaseTenantRepository {
  async save(prof: ModelLatencyProfile): Promise<void> {
    await prisma.modelLatencyProfile.upsert({
      where: { id: prof.id },
      update: { averageLatencyMs: prof.averageLatencyMs, percentile95Ms: prof.percentile95Ms, lastSampledAt: prof.lastSampledAt },
      create: {
        id: prof.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: prof.modelId,
        averageLatencyMs: prof.averageLatencyMs,
        percentile95Ms: prof.percentile95Ms,
        lastSampledAt: prof.lastSampledAt,
      },
    });
  }
}

export class ModelHealthStatusRepository extends BaseTenantRepository {
  async save(health: ModelHealthStatus): Promise<void> {
    await prisma.modelHealthStatus.upsert({
      where: { id: health.id },
      update: { successRate: health.successRate, totalInvocations: health.totalInvocations, lastFailureReason: health.lastFailureReason },
      create: {
        id: health.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: health.modelId,
        successRate: health.successRate,
        totalInvocations: health.totalInvocations,
        lastFailureReason: health.lastFailureReason,
      },
    });
  }
}

export class AiModelRegistryRepository extends BaseTenantRepository {
  async save(reg: AiModelRegistry): Promise<void> {
    await prisma.aiModelRegistry.upsert({
      where: { id: reg.id },
      update: { currentStage: reg.currentStage, metadataJson: reg.metadataJson },
      create: {
        id: reg.id,
        tenantId: this.getTenantIdOrThrow(),
        modelName: reg.modelName,
        provider: reg.provider,
        currentStage: reg.currentStage,
        metadataJson: reg.metadataJson,
      },
    });
  }
}

export class AiModelVersionRepository extends BaseTenantRepository {
  async save(ver: AiModelVersion): Promise<void> {
    await prisma.aiModelVersion.upsert({
      where: { id: ver.id },
      update: { stage: ver.stage, parametersJson: ver.parametersJson },
      create: {
        id: ver.id,
        tenantId: this.getTenantIdOrThrow(),
        registryId: ver.registryId,
        versionNumber: ver.versionNumber,
        stage: ver.stage,
        parametersJson: ver.parametersJson,
      },
    });
  }
}

export class AiModelEvaluationHistoryRepository extends BaseTenantRepository {
  async save(hist: AiModelEvaluationHistory): Promise<void> {
    await prisma.aiModelEvaluationHistory.create({
      data: {
        id: hist.id,
        tenantId: this.getTenantIdOrThrow(),
        versionId: hist.versionId,
        metricName: hist.metricName,
        metricValue: hist.metricValue,
      },
    });
  }
}

export class PromptCollectionRepository extends BaseTenantRepository {
  async save(coll: PromptCollection): Promise<void> {
    await prisma.promptCollection.upsert({
      where: { id: coll.id },
      update: { description: coll.description },
      create: {
        id: coll.id,
        tenantId: this.getTenantIdOrThrow(),
        name: coll.name,
        description: coll.description,
      },
    });
  }
}

export class PromptComponentRepository extends BaseTenantRepository {
  async save(comp: PromptComponent): Promise<void> {
    await prisma.promptComponent.create({
      data: {
        id: comp.id,
        tenantId: this.getTenantIdOrThrow(),
        collectionId: comp.collectionId,
        componentType: comp.componentType,
        content: comp.content,
      },
    });
  }
}

export class EmbeddingModelRegistryRepository extends BaseTenantRepository {
  async save(emb: EmbeddingModelRegistry): Promise<void> {
    await prisma.embeddingModelRegistry.upsert({
      where: { id: emb.id },
      update: { status: emb.status },
      create: {
        id: emb.id,
        tenantId: this.getTenantIdOrThrow(),
        modelName: emb.modelName,
        dimensions: emb.dimensions,
        distanceMetric: emb.distanceMetric,
        status: emb.status,
      },
    });
  }
}

export class AgentExecutionContextRepository extends BaseTenantRepository {
  async save(ctx: AgentExecutionContext): Promise<void> {
    await prisma.agentExecutionContext.upsert({
      where: { id: ctx.id },
      update: { state: ctx.state, retryCount: ctx.retryCount },
      create: {
        id: ctx.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: ctx.agentId,
        state: ctx.state,
        timeoutMs: ctx.timeoutMs,
        retryCount: ctx.retryCount,
      },
    });
  }
}

export class AgentExecutionCheckpointRepository extends BaseTenantRepository {
  async save(chk: AgentExecutionCheckpoint): Promise<void> {
    await prisma.agentExecutionCheckpoint.create({
      data: {
        id: chk.id,
        tenantId: this.getTenantIdOrThrow(),
        contextId: chk.contextId,
        stepIndex: chk.stepIndex,
        stateSnapshot: chk.stateSnapshot,
      },
    });
  }
}

export class AgentPermissionRepository extends BaseTenantRepository {
  async save(perm: AgentPermission): Promise<void> {
    await prisma.agentPermission.upsert({
      where: { id: perm.id },
      update: { allowedTools: perm.allowedTools, allowedModels: perm.allowedModels, executionBudget: perm.executionBudget },
      create: {
        id: perm.id,
        tenantId: this.getTenantIdOrThrow(),
        agentId: perm.agentId,
        allowedTools: perm.allowedTools,
        allowedModels: perm.allowedModels,
        executionBudget: perm.executionBudget,
      },
    });
  }
}

export class ToolRegistryRepository extends BaseTenantRepository {
  async save(tool: ToolRegistry): Promise<void> {
    await prisma.toolRegistry.upsert({
      where: { id: tool.id },
      update: { schemaJson: tool.schemaJson, authConfigJson: tool.authConfigJson },
      create: {
        id: tool.id,
        tenantId: this.getTenantIdOrThrow(),
        name: tool.name,
        version: tool.toolVersion,
        category: tool.category,
        schemaJson: tool.schemaJson,
        authConfigJson: tool.authConfigJson,
      },
    });
  }
}

export class AiCacheEntryRepository extends BaseTenantRepository {
  async save(entry: AiCacheEntry): Promise<void> {
    await prisma.aiCacheEntry.upsert({
      where: { id: entry.id },
      update: { hitCount: entry.hitCount },
      create: {
        id: entry.id,
        tenantId: this.getTenantIdOrThrow(),
        cacheType: entry.cacheType,
        keyHash: entry.keyHash,
        valueText: entry.valueText,
        hitCount: entry.hitCount,
        ttlSeconds: entry.ttlSeconds,
      },
    });
  }
}

export class AiExperimentRepository extends BaseTenantRepository {
  async save(exp: AiExperiment): Promise<void> {
    await prisma.aiExperiment.upsert({
      where: { id: exp.id },
      update: { status: exp.status, trafficSplit: exp.trafficSplit },
      create: {
        id: exp.id,
        tenantId: this.getTenantIdOrThrow(),
        name: exp.name,
        experimentType: exp.experimentType,
        trafficSplit: exp.trafficSplit,
        status: exp.status,
      },
    });
  }
}

export class AiDatasetRepository extends BaseTenantRepository {
  async save(ds: AiDataset): Promise<void> {
    await prisma.aiDataset.create({
      data: {
        id: ds.id,
        tenantId: this.getTenantIdOrThrow(),
        name: ds.name,
        datasetType: ds.datasetType,
        version: ds.datasetVersion,
        storageUrl: ds.storageUrl,
      },
    });
  }
}

export class FineTuningJobRepository extends BaseTenantRepository {
  async save(job: FineTuningJob): Promise<void> {
    await prisma.fineTuningJob.upsert({
      where: { id: job.id },
      update: { status: job.status, metricsJson: job.metricsJson, completedAt: job.completedAt },
      create: {
        id: job.id,
        tenantId: this.getTenantIdOrThrow(),
        baseModel: job.baseModel,
        datasetId: job.datasetId,
        status: job.status,
        metricsJson: job.metricsJson,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
      },
    });
  }
}

export class AiPolicyRepository extends BaseTenantRepository {
  async save(pol: AiPolicy): Promise<void> {
    await prisma.aiPolicy.upsert({
      where: { id: pol.id },
      update: { isEnabled: pol.isEnabled, rulesJson: pol.rulesJson },
      create: {
        id: pol.id,
        tenantId: this.getTenantIdOrThrow(),
        name: pol.name,
        policyType: pol.policyType,
        rulesJson: pol.rulesJson,
        isEnabled: pol.isEnabled,
      },
    });
  }
}

export class AiTelemetryMetricRepository extends BaseTenantRepository {
  async save(tel: AiTelemetryMetric): Promise<void> {
    await prisma.aiTelemetryMetric.create({
      data: {
        id: tel.id,
        tenantId: this.getTenantIdOrThrow(),
        metricType: tel.metricType,
        metricValue: tel.metricValue,
      },
    });
  }
}

export class ReasoningTraceRepository extends BaseTenantRepository {
  async save(trace: ReasoningTrace): Promise<void> {
    await prisma.reasoningTrace.create({
      data: {
        id: trace.id,
        tenantId: this.getTenantIdOrThrow(),
        executionId: trace.executionId,
        traceTimeline: trace.traceTimeline,
        decisionGraph: trace.decisionGraph,
      },
    });
  }
}

export class AiPlatformJobRepository extends BaseTenantRepository {
  async save(job: AiPlatformJob): Promise<void> {
    await prisma.aiPlatformJob.upsert({
      where: { id: job.id },
      update: { status: job.status },
      create: {
        id: job.id,
        tenantId: this.getTenantIdOrThrow(),
        jobType: job.jobType,
        priority: job.priority,
        payloadJson: job.payloadJson,
        status: job.status,
        runAfter: job.runAfter,
      },
    });
  }
}

export class McpServerRegistryRepository extends BaseTenantRepository {
  async save(reg: McpServerRegistry): Promise<void> {
    await prisma.mcpServerRegistry.upsert({
      where: { id: reg.id },
      update: { isEnabled: reg.isEnabled },
      create: {
        id: reg.id,
        tenantId: this.getTenantIdOrThrow(),
        serverName: reg.serverName,
        endpointUrl: reg.endpointUrl,
        isEnabled: reg.isEnabled,
      },
    });
  }
}

export class AiMarketplaceExtensionRepository extends BaseTenantRepository {
  async save(ext: AiMarketplaceExtension): Promise<void> {
    await prisma.aiMarketplaceExtension.upsert({
      where: { id: ext.id },
      update: { extensionVersion: ext.extensionVersion },
      create: {
        id: ext.id,
        tenantId: this.getTenantIdOrThrow(),
        extensionName: ext.extensionName,
        publisher: ext.publisher,
        extensionVersion: ext.extensionVersion,
        compatibilityJson: ext.compatibilityJson,
        digitalSignature: ext.digitalSignature,
      },
    });
  }
}

export class RetrievalEvaluationMetricRepository extends BaseTenantRepository {
  async save(metric: RetrievalEvaluationMetric): Promise<void> {
    await prisma.retrievalEvaluationMetric.create({
      data: {
        id: metric.id,
        tenantId: this.getTenantIdOrThrow(),
        retrievalId: metric.retrievalId,
        recallScore: metric.recallScore,
        precisionScore: metric.precisionScore,
      },
    });
  }
}

export class AiEventStoreRepository extends BaseTenantRepository {
  async save(event: AiEventStore): Promise<void> {
    await prisma.aiEventStore.create({
      data: {
        id: event.id,
        tenantId: this.getTenantIdOrThrow(),
        aggregateType: event.aggregateType,
        aggregateId: event.aggregateId,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        payloadJson: event.payloadJson,
        correlationId: event.correlationId,
        causationId: event.causationId,
      },
    });
  }
}

export class AiFeatureStoreRepository extends BaseTenantRepository {
  async save(feature: AiFeatureStore): Promise<void> {
    await prisma.aiFeatureStore.upsert({
      where: { id: feature.id },
      update: { featureName: feature.featureName },
      create: {
        id: feature.id,
        tenantId: this.getTenantIdOrThrow(),
        featureName: feature.featureName,
        groupName: feature.groupName,
        valueType: feature.valueType,
        metadataJson: feature.metadataJson,
      },
    });
  }
}

export class AiModelDeploymentRepository extends BaseTenantRepository {
  async save(dep: AiModelDeployment): Promise<void> {
    await prisma.aiModelDeployment.upsert({
      where: { id: dep.id },
      update: { trafficWeight: dep.trafficWeight, status: dep.status },
      create: {
        id: dep.id,
        tenantId: this.getTenantIdOrThrow(),
        modelId: dep.modelId,
        deploymentStage: dep.deploymentStage,
        trafficWeight: dep.trafficWeight,
        status: dep.status,
      },
    });
  }
}

export class AiEvaluationReportRepository extends BaseTenantRepository {
  async save(rep: AiEvaluationReport): Promise<void> {
    await prisma.aiEvaluationReport.create({
      data: {
        id: rep.id,
        tenantId: this.getTenantIdOrThrow(),
        evaluationType: rep.evaluationType,
        recallScore: rep.recallScore,
        precisionScore: rep.precisionScore,
        benchmarkResults: rep.benchmarkResults,
        reportSummary: rep.reportSummary,
      },
    });
  }
}

export class AiPlatformBudgetRepository extends BaseTenantRepository {
  async save(bud: AiPlatformBudget): Promise<void> {
    await prisma.aiPlatformBudget.upsert({
      where: { id: bud.id },
      update: { tokenLimit: bud.tokenLimit },
      create: {
        id: bud.id,
        tenantId: this.getTenantIdOrThrow(),
        targetType: bud.targetType,
        targetId: bud.targetId,
        cpuLimit: bud.cpuLimit,
        memoryLimit: bud.memoryLimit,
        tokenLimit: bud.tokenLimit,
        timeoutLimit: bud.timeoutLimit,
      },
    });
  }
}

export class AiEncryptedSecretRepository extends BaseTenantRepository {
  async save(sec: AiEncryptedSecret): Promise<void> {
    await prisma.aiEncryptedSecret.upsert({
      where: { id: sec.id },
      update: { encryptedVal: sec.encryptedVal },
      create: {
        id: sec.id,
        tenantId: this.getTenantIdOrThrow(),
        secretKey: sec.secretKey,
        encryptedVal: sec.encryptedVal,
        providerName: sec.providerName,
      },
    });
  }
}

export class AiDisasterBackupRepository extends BaseTenantRepository {
  async save(back: AiDisasterBackup): Promise<void> {
    await prisma.aiDisasterBackup.create({
      data: {
        id: back.id,
        tenantId: this.getTenantIdOrThrow(),
        backupType: back.backupType,
        backupPath: back.backupPath,
        sizeBytes: back.sizeBytes,
      },
    });
  }
}

export class AiVectorSyncJobRepository extends BaseTenantRepository {
  async save(job: AiVectorSyncJob): Promise<void> {
    await prisma.aiVectorSyncJob.upsert({
      where: { id: job.id },
      update: { status: job.status },
      create: {
        id: job.id,
        tenantId: this.getTenantIdOrThrow(),
        syncType: job.syncType,
        compaction: job.compaction,
        status: job.status,
      },
    });
  }
}



