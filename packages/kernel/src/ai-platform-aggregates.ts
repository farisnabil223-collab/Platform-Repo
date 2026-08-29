import { AggregateRoot } from './aggregate-root';

export interface AiModelProps {
  tenantId: string;
  modelName: string;
  modelType: string;
  maxTokens: number;
  contextWindow: number;
  isDefault: boolean;
}

export class AiModel extends AggregateRoot<AiModelProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelName(): string { return this.props.modelName; }
  get modelType(): string { return this.props.modelType; }
  get maxTokens(): number { return this.props.maxTokens; }
  get contextWindow(): number { return this.props.contextWindow; }
  get isDefault(): boolean { return this.props.isDefault; }
}

export interface AiProviderProps {
  tenantId: string;
  providerName: string;
  apiEndpoint: string;
  isProviderActive: boolean;
  credentialsJson: Record<string, any>;
}

export class AiProvider extends AggregateRoot<AiProviderProps> {
  get tenantId(): string { return this.props.tenantId; }
  get providerName(): string { return this.props.providerName; }
  get apiEndpoint(): string { return this.props.apiEndpoint; }
  get isProviderActive(): boolean { return this.props.isProviderActive; }
  get credentialsJson(): Record<string, any> { return this.props.credentialsJson; }
}

export interface AiConversationProps {
  tenantId: string;
  title: string;
  userId: string;
  metaJson: Record<string, any>;
  isArchived: boolean;
}

export class AiConversation extends AggregateRoot<AiConversationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get userId(): string { return this.props.userId; }
  get metaJson(): Record<string, any> { return this.props.metaJson; }
  get isArchived(): boolean { return this.props.isArchived; }
}

export interface AiConversationMessageProps {
  tenantId: string;
  conversationId: string;
  senderType: string;
  content: string;
  tokensUsed: number;
}

export class AiConversationMessage extends AggregateRoot<AiConversationMessageProps> {
  get tenantId(): string { return this.props.tenantId; }
  get conversationId(): string { return this.props.conversationId; }
  get senderType(): string { return this.props.senderType; }
  get content(): string { return this.props.content; }
  get tokensUsed(): number { return this.props.tokensUsed; }
}

export interface AiPromptTemplateProps {
  tenantId: string;
  name: string;
  description?: string;
  category: string;
  isDefault: boolean;
}

export class AiPromptTemplate extends AggregateRoot<AiPromptTemplateProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get category(): string { return this.props.category; }
  get isDefault(): boolean { return this.props.isDefault; }
}

export interface AiPromptVersionProps {
  tenantId: string;
  templateId: string;
  versionNumber: number;
  promptText: string;
  approvedByEmail?: string;
}

export class AiPromptVersion extends AggregateRoot<AiPromptVersionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get templateId(): string { return this.props.templateId; }
  get versionNumber(): number { return this.props.versionNumber; }
  get promptText(): string { return this.props.promptText; }
  get approvedByEmail(): string | undefined { return this.props.approvedByEmail; }
}

export interface AiPromptExecutionProps {
  tenantId: string;
  versionId: string;
  userId: string;
  inputsJson: Record<string, any>;
  outputText: string;
  latencyMs: number;
  cost: number;
}

export class AiPromptExecution extends AggregateRoot<AiPromptExecutionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get versionId(): string { return this.props.versionId; }
  get userId(): string { return this.props.userId; }
  get inputsJson(): Record<string, any> { return this.props.inputsJson; }
  get outputText(): string { return this.props.outputText; }
  get latencyMs(): number { return this.props.latencyMs; }
  get cost(): number { return this.props.cost; }
}

export interface AiKnowledgeBaseProps {
  tenantId: string;
  name: string;
  description?: string;
  isVectorSyncActive: boolean;
}

export class AiKnowledgeBase extends AggregateRoot<AiKnowledgeBaseProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get isVectorSyncActive(): boolean { return this.props.isVectorSyncActive; }
}

export interface KnowledgeDocumentProps {
  tenantId: string;
  knowledgeBaseId: string;
  docName: string;
  storageUrl: string;
  fileType: string;
  fileSize: number;
}

export class KnowledgeDocument extends AggregateRoot<KnowledgeDocumentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get knowledgeBaseId(): string { return this.props.knowledgeBaseId; }
  get docName(): string { return this.props.docName; }
  get storageUrl(): string { return this.props.storageUrl; }
  get fileType(): string { return this.props.fileType; }
  get fileSize(): number { return this.props.fileSize; }
}

export interface AiKnowledgeChunkProps {
  tenantId: string;
  documentId: string;
  contentText: string;
  tokenLength: number;
  chunkIndex: number;
}

export class AiKnowledgeChunk extends AggregateRoot<AiKnowledgeChunkProps> {
  get tenantId(): string { return this.props.tenantId; }
  get documentId(): string { return this.props.documentId; }
  get contentText(): string { return this.props.contentText; }
  get tokenLength(): number { return this.props.tokenLength; }
  get chunkIndex(): number { return this.props.chunkIndex; }
}

export interface EmbeddingVectorProps {
  tenantId: string;
  chunkId: string;
  vectorValuesJson: Record<string, any>;
  modelUsed: string;
}

export class EmbeddingVector extends AggregateRoot<EmbeddingVectorProps> {
  get tenantId(): string { return this.props.tenantId; }
  get chunkId(): string { return this.props.chunkId; }
  get vectorValuesJson(): Record<string, any> { return this.props.vectorValuesJson; }
  get modelUsed(): string { return this.props.modelUsed; }
}

export interface VectorIndexProps {
  tenantId: string;
  indexName: string;
  dimensions: number;
  distanceMetric: string;
  lastBuiltAt: Date;
}

export class VectorIndex extends AggregateRoot<VectorIndexProps> {
  get tenantId(): string { return this.props.tenantId; }
  get indexName(): string { return this.props.indexName; }
  get dimensions(): number { return this.props.dimensions; }
  get distanceMetric(): string { return this.props.distanceMetric; }
  get lastBuiltAt(): Date { return this.props.lastBuiltAt; }
}

export interface RetrievalSessionProps {
  tenantId: string;
  userId: string;
  queryText: string;
  retrievalParametersJson: Record<string, any>;
}

export class RetrievalSession extends AggregateRoot<RetrievalSessionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get queryText(): string { return this.props.queryText; }
  get retrievalParametersJson(): Record<string, any> { return this.props.retrievalParametersJson; }
}

export interface RetrievalResultProps {
  tenantId: string;
  sessionId: string;
  chunkId: string;
  score: number;
  relevanceRank: number;
}

export class RetrievalResult extends AggregateRoot<RetrievalResultProps> {
  get tenantId(): string { return this.props.tenantId; }
  get sessionId(): string { return this.props.sessionId; }
  get chunkId(): string { return this.props.chunkId; }
  get score(): number { return this.props.score; }
  get relevanceRank(): number { return this.props.relevanceRank; }
}

export interface AiAgentProps {
  tenantId: string;
  agentName: string;
  agentRole: string;
  temperature: number;
  systemPrompt: string;
}

export class AiAgent extends AggregateRoot<AiAgentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentName(): string { return this.props.agentName; }
  get agentRole(): string { return this.props.agentRole; }
  get temperature(): number { return this.props.temperature; }
  get systemPrompt(): string { return this.props.systemPrompt; }
}

export interface AgentCapabilityProps {
  tenantId: string;
  agentId: string;
  capabilityName: string;
  isEnabled: boolean;
}

export class AgentCapability extends AggregateRoot<AgentCapabilityProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get capabilityName(): string { return this.props.capabilityName; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface AgentExecutionProps {
  tenantId: string;
  agentId: string;
  status: string;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
}

export class AgentExecution extends AggregateRoot<AgentExecutionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get status(): string { return this.props.status; }
  get errorMessage(): string | undefined { return this.props.errorMessage; }
  get startedAt(): Date { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
}

export interface AgentMemoryProps {
  tenantId: string;
  agentId: string;
  memoryKey: string;
  memoryValue: string;
  contextType: string;
}

export class AgentMemory extends AggregateRoot<AgentMemoryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get memoryKey(): string { return this.props.memoryKey; }
  get memoryValue(): string { return this.props.memoryValue; }
  get contextType(): string { return this.props.contextType; }
}

export interface AgentGoalProps {
  tenantId: string;
  agentId: string;
  goalText: string;
  isAchieved: boolean;
  priority: number;
}

export class AgentGoal extends AggregateRoot<AgentGoalProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get goalText(): string { return this.props.goalText; }
  get isAchieved(): boolean { return this.props.isAchieved; }
  get priority(): number { return this.props.priority; }
}

export interface AgentTaskProps {
  tenantId: string;
  agentId: string;
  taskText: string;
  status: string;
  dependencyTaskId?: string;
}

export class AgentTask extends AggregateRoot<AgentTaskProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get taskText(): string { return this.props.taskText; }
  get status(): string { return this.props.status; }
  get dependencyTaskId(): string | undefined { return this.props.dependencyTaskId; }
}

export interface AgentToolProps {
  tenantId: string;
  toolName: string;
  description: string;
  parametersSchemaJson: Record<string, any>;
  isUserApprovedRequired: boolean;
}

export class AgentTool extends AggregateRoot<AgentToolProps> {
  get tenantId(): string { return this.props.tenantId; }
  get toolName(): string { return this.props.toolName; }
  get description(): string { return this.props.description; }
  get parametersSchemaJson(): Record<string, any> { return this.props.parametersSchemaJson; }
  get isUserApprovedRequired(): boolean { return this.props.isUserApprovedRequired; }
}

export interface ToolExecutionProps {
  tenantId: string;
  agentExecutionId: string;
  toolId: string;
  inputsJson: Record<string, any>;
  outputsJson: Record<string, any>;
  durationMs: number;
}

export class ToolExecution extends AggregateRoot<ToolExecutionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentExecutionId(): string { return this.props.agentExecutionId; }
  get toolId(): string { return this.props.toolId; }
  get inputsJson(): Record<string, any> { return this.props.inputsJson; }
  get outputsJson(): Record<string, any> { return this.props.outputsJson; }
  get durationMs(): number { return this.props.durationMs; }
}

export interface WorkflowAutomationProps {
  tenantId: string;
  name: string;
  description?: string;
  isAutomationEnabled: boolean;
}

export class WorkflowAutomation extends AggregateRoot<WorkflowAutomationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get isAutomationEnabled(): boolean { return this.props.isAutomationEnabled; }
}

export interface AutomationTriggerProps {
  tenantId: string;
  workflowId: string;
  triggerType: string;
  conditionsJson: Record<string, any>;
}

export class AutomationTrigger extends AggregateRoot<AutomationTriggerProps> {
  get tenantId(): string { return this.props.tenantId; }
  get workflowId(): string { return this.props.workflowId; }
  get triggerType(): string { return this.props.triggerType; }
  get conditionsJson(): Record<string, any> { return this.props.conditionsJson; }
}

export interface AutomationExecutionProps {
  tenantId: string;
  workflowId: string;
  status: string;
  logsText: string;
  durationMs: number;
}

export class AutomationExecution extends AggregateRoot<AutomationExecutionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get workflowId(): string { return this.props.workflowId; }
  get status(): string { return this.props.status; }
  get logsText(): string { return this.props.logsText; }
  get durationMs(): number { return this.props.durationMs; }
}

export interface AiRecommendationProps {
  tenantId: string;
  targetType: string;
  targetId: string;
  recommendationText: string;
  confidenceScore: number;
}

export class AiRecommendation extends AggregateRoot<AiRecommendationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get targetType(): string { return this.props.targetType; }
  get targetId(): string { return this.props.targetId; }
  get recommendationText(): string { return this.props.recommendationText; }
  get confidenceScore(): number { return this.props.confidenceScore; }
}

export interface AiInsightProps {
  tenantId: string;
  category: string;
  insightText: string;
  impactScore: number;
  relevanceTagsJson: Record<string, any>;
}

export class AiInsight extends AggregateRoot<AiInsightProps> {
  get tenantId(): string { return this.props.tenantId; }
  get category(): string { return this.props.category; }
  get insightText(): string { return this.props.insightText; }
  get impactScore(): number { return this.props.impactScore; }
  get relevanceTagsJson(): Record<string, any> { return this.props.relevanceTagsJson; }
}

export interface AiDecisionProps {
  tenantId: string;
  insightId: string;
  actionTaken: string;
  executedByEmail: string;
  status: string;
}

export class AiDecision extends AggregateRoot<AiDecisionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get insightId(): string { return this.props.insightId; }
  get actionTaken(): string { return this.props.actionTaken; }
  get executedByEmail(): string { return this.props.executedByEmail; }
  get status(): string { return this.props.status; }
}

export interface AiEvaluationProps {
  tenantId: string;
  modelId: string;
  promptVersionId: string;
  rating: number;
  feedbackText?: string;
}

export class AiEvaluation extends AggregateRoot<AiEvaluationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get promptVersionId(): string { return this.props.promptVersionId; }
  get rating(): number { return this.props.rating; }
  get feedbackText(): string | undefined { return this.props.feedbackText; }
}

export interface AiFeedbackProps {
  tenantId: string;
  conversationId: string;
  messageIndex: number;
  isThumbsUp: boolean;
  comments?: string;
}

export class AiFeedback extends AggregateRoot<AiFeedbackProps> {
  get tenantId(): string { return this.props.tenantId; }
  get conversationId(): string { return this.props.conversationId; }
  get messageIndex(): number { return this.props.messageIndex; }
  get isThumbsUp(): boolean { return this.props.isThumbsUp; }
  get comments(): string | undefined { return this.props.comments; }
}

export interface AiAuditLogProps {
  tenantId: string;
  userId: string;
  action: string;
  modelId: string;
  inputLength: number;
  outputLength: number;
}

export class AiAuditLog extends AggregateRoot<AiAuditLogProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get action(): string { return this.props.action; }
  get modelId(): string { return this.props.modelId; }
  get inputLength(): number { return this.props.inputLength; }
  get outputLength(): number { return this.props.outputLength; }
}

export interface AiUsageMetricProps {
  tenantId: string;
  modelId: string;
  promptsCount: number;
  messagesCount: number;
  totalTokensUsed: number;
}

export class AiUsageMetric extends AggregateRoot<AiUsageMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get promptsCount(): number { return this.props.promptsCount; }
  get messagesCount(): number { return this.props.messagesCount; }
  get totalTokensUsed(): number { return this.props.totalTokensUsed; }
}

export interface AiCostMetricProps {
  tenantId: string;
  modelId: string;
  modelCostInUsd: number;
  costLimitAlertThreshold: number;
}

export class AiCostMetric extends AggregateRoot<AiCostMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get modelCostInUsd(): number { return this.props.modelCostInUsd; }
  get costLimitAlertThreshold(): number { return this.props.costLimitAlertThreshold; }
}

export interface AiQuotaProps {
  tenantId: string;
  monthlyTokenLimit: number;
  currentTokenUsage: number;
  resetAt: Date;
}

export class AiQuota extends AggregateRoot<AiQuotaProps> {
  get tenantId(): string { return this.props.tenantId; }
  get monthlyTokenLimit(): number { return this.props.monthlyTokenLimit; }
  get currentTokenUsage(): number { return this.props.currentTokenUsage; }
  get resetAt(): Date { return this.props.resetAt; }
}

export interface ModelRouterProps {
  tenantId: string;
  routerName: string;
  routingStrategy: string;
  isEnabled: boolean;
}

export class ModelRouter extends AggregateRoot<ModelRouterProps> {
  get tenantId(): string { return this.props.tenantId; }
  get routerName(): string { return this.props.routerName; }
  get routingStrategy(): string { return this.props.routingStrategy; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface RoutingPolicyProps {
  tenantId: string;
  routerId: string;
  policyName: string;
  minLatencyMs: number;
  maxCostLimit: number;
}

export class RoutingPolicy extends AggregateRoot<RoutingPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get routerId(): string { return this.props.routerId; }
  get policyName(): string { return this.props.policyName; }
  get minLatencyMs(): number { return this.props.minLatencyMs; }
  get maxCostLimit(): number { return this.props.maxCostLimit; }
}

export interface RoutingRuleProps {
  tenantId: string;
  policyId: string;
  ruleCondition: string;
  targetModelId: string;
  priority: number;
}

export class RoutingRule extends AggregateRoot<RoutingRuleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyId(): string { return this.props.policyId; }
  get ruleCondition(): string { return this.props.ruleCondition; }
  get targetModelId(): string { return this.props.targetModelId; }
  get priority(): number { return this.props.priority; }
}

export interface ModelCapabilityProps {
  tenantId: string;
  modelId: string;
  capabilityName: string;
  isSupported: boolean;
}

export class ModelCapability extends AggregateRoot<ModelCapabilityProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get capabilityName(): string { return this.props.capabilityName; }
  get isSupported(): boolean { return this.props.isSupported; }
}

export interface ModelAvailabilityProps {
  tenantId: string;
  modelId: string;
  provider: string;
  isOnline: boolean;
  lastCheckedAt: Date;
}

export class ModelAvailability extends AggregateRoot<ModelAvailabilityProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get provider(): string { return this.props.provider; }
  get isOnline(): boolean { return this.props.isOnline; }
  get lastCheckedAt(): Date { return this.props.lastCheckedAt; }
}

export interface ModelLatencyProfileProps {
  tenantId: string;
  modelId: string;
  averageLatencyMs: number;
  percentile95Ms: number;
  lastSampledAt: Date;
}

export class ModelLatencyProfile extends AggregateRoot<ModelLatencyProfileProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get averageLatencyMs(): number { return this.props.averageLatencyMs; }
  get percentile95Ms(): number { return this.props.percentile95Ms; }
  get lastSampledAt(): Date { return this.props.lastSampledAt; }
}

export interface ModelHealthStatusProps {
  tenantId: string;
  modelId: string;
  successRate: number;
  totalInvocations: number;
  lastFailureReason?: string;
}

export class ModelHealthStatus extends AggregateRoot<ModelHealthStatusProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get successRate(): number { return this.props.successRate; }
  get totalInvocations(): number { return this.props.totalInvocations; }
  get lastFailureReason(): string | undefined { return this.props.lastFailureReason; }
}

export interface AiModelRegistryProps {
  tenantId: string;
  modelName: string;
  provider: string;
  currentStage: string;
  metadataJson: Record<string, any>;
}

export class AiModelRegistry extends AggregateRoot<AiModelRegistryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelName(): string { return this.props.modelName; }
  get provider(): string { return this.props.provider; }
  get currentStage(): string { return this.props.currentStage; }
  get metadataJson(): Record<string, any> { return this.props.metadataJson; }
}

export interface AiModelVersionProps {
  tenantId: string;
  registryId: string;
  versionNumber: string;
  stage: string;
  parametersJson: Record<string, any>;
}

export class AiModelVersion extends AggregateRoot<AiModelVersionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get registryId(): string { return this.props.registryId; }
  get versionNumber(): string { return this.props.versionNumber; }
  get stage(): string { return this.props.stage; }
  get parametersJson(): Record<string, any> { return this.props.parametersJson; }
}

export interface AiModelEvaluationHistoryProps {
  tenantId: string;
  versionId: string;
  metricName: string;
  metricValue: number;
}

export class AiModelEvaluationHistory extends AggregateRoot<AiModelEvaluationHistoryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get versionId(): string { return this.props.versionId; }
  get metricName(): string { return this.props.metricName; }
  get metricValue(): number { return this.props.metricValue; }
}

export interface PromptCollectionProps {
  tenantId: string;
  name: string;
  description?: string;
}

export class PromptCollection extends AggregateRoot<PromptCollectionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
}

export interface PromptComponentProps {
  tenantId: string;
  collectionId: string;
  componentType: string;
  content: string;
}

export class PromptComponent extends AggregateRoot<PromptComponentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get collectionId(): string { return this.props.collectionId; }
  get componentType(): string { return this.props.componentType; }
  get content(): string { return this.props.content; }
}

export interface EmbeddingModelRegistryProps {
  tenantId: string;
  modelName: string;
  dimensions: number;
  distanceMetric: string;
  status: string;
}

export class EmbeddingModelRegistry extends AggregateRoot<EmbeddingModelRegistryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelName(): string { return this.props.modelName; }
  get dimensions(): number { return this.props.dimensions; }
  get distanceMetric(): string { return this.props.distanceMetric; }
  get status(): string { return this.props.status; }
}

export interface AgentExecutionContextProps {
  tenantId: string;
  agentId: string;
  state: string;
  timeoutMs: number;
  retryCount: number;
}

export class AgentExecutionContext extends AggregateRoot<AgentExecutionContextProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get state(): string { return this.props.state; }
  get timeoutMs(): number { return this.props.timeoutMs; }
  get retryCount(): number { return this.props.retryCount; }
}

export interface AgentExecutionCheckpointProps {
  tenantId: string;
  contextId: string;
  stepIndex: number;
  stateSnapshot: Record<string, any>;
}

export class AgentExecutionCheckpoint extends AggregateRoot<AgentExecutionCheckpointProps> {
  get tenantId(): string { return this.props.tenantId; }
  get contextId(): string { return this.props.contextId; }
  get stepIndex(): number { return this.props.stepIndex; }
  get stateSnapshot(): Record<string, any> { return this.props.stateSnapshot; }
}

export interface AgentPermissionProps {
  tenantId: string;
  agentId: string;
  allowedTools: string[];
  allowedModels: string[];
  executionBudget: number;
}

export class AgentPermission extends AggregateRoot<AgentPermissionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agentId(): string { return this.props.agentId; }
  get allowedTools(): string[] { return this.props.allowedTools; }
  get allowedModels(): string[] { return this.props.allowedModels; }
  get executionBudget(): number { return this.props.executionBudget; }
}

export interface ToolRegistryProps {
  tenantId: string;
  name: string;
  toolVersion: string;
  category: string;
  schemaJson: Record<string, any>;
  authConfigJson: Record<string, any>;
}

export class ToolRegistry extends AggregateRoot<ToolRegistryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get toolVersion(): string { return this.props.toolVersion; }
  get category(): string { return this.props.category; }
  get schemaJson(): Record<string, any> { return this.props.schemaJson; }
  get authConfigJson(): Record<string, any> { return this.props.authConfigJson; }
}

export interface AiCacheEntryProps {
  tenantId: string;
  cacheType: string;
  keyHash: string;
  valueText: string;
  hitCount: number;
  ttlSeconds: number;
}

export class AiCacheEntry extends AggregateRoot<AiCacheEntryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get cacheType(): string { return this.props.cacheType; }
  get keyHash(): string { return this.props.keyHash; }
  get valueText(): string { return this.props.valueText; }
  get hitCount(): number { return this.props.hitCount; }
  get ttlSeconds(): number { return this.props.ttlSeconds; }
}

export interface AiExperimentProps {
  tenantId: string;
  name: string;
  experimentType: string;
  trafficSplit: Record<string, any>;
  status: string;
}

export class AiExperiment extends AggregateRoot<AiExperimentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get experimentType(): string { return this.props.experimentType; }
  get trafficSplit(): Record<string, any> { return this.props.trafficSplit; }
  get status(): string { return this.props.status; }
}

export interface AiDatasetProps {
  tenantId: string;
  name: string;
  datasetType: string;
  datasetVersion: string;
  storageUrl: string;
}

export class AiDataset extends AggregateRoot<AiDatasetProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get datasetType(): string { return this.props.datasetType; }
  get datasetVersion(): string { return this.props.datasetVersion; }
  get storageUrl(): string { return this.props.storageUrl; }
}

export interface FineTuningJobProps {
  tenantId: string;
  baseModel: string;
  datasetId: string;
  status: string;
  metricsJson: Record<string, any>;
  startedAt?: Date;
  completedAt?: Date;
}

export class FineTuningJob extends AggregateRoot<FineTuningJobProps> {
  get tenantId(): string { return this.props.tenantId; }
  get baseModel(): string { return this.props.baseModel; }
  get datasetId(): string { return this.props.datasetId; }
  get status(): string { return this.props.status; }
  get metricsJson(): Record<string, any> { return this.props.metricsJson; }
  get startedAt(): Date | undefined { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
}

export interface AiPolicyProps {
  tenantId: string;
  name: string;
  policyType: string;
  rulesJson: Record<string, any>;
  isEnabled: boolean;
}

export class AiPolicy extends AggregateRoot<AiPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get policyType(): string { return this.props.policyType; }
  get rulesJson(): Record<string, any> { return this.props.rulesJson; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface AiTelemetryMetricProps {
  tenantId: string;
  metricType: string;
  metricValue: number;
}

export class AiTelemetryMetric extends AggregateRoot<AiTelemetryMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get metricType(): string { return this.props.metricType; }
  get metricValue(): number { return this.props.metricValue; }
}

export interface ReasoningTraceProps {
  tenantId: string;
  executionId: string;
  traceTimeline: Record<string, any>;
  decisionGraph: Record<string, any>;
}

export class ReasoningTrace extends AggregateRoot<ReasoningTraceProps> {
  get tenantId(): string { return this.props.tenantId; }
  get executionId(): string { return this.props.executionId; }
  get traceTimeline(): Record<string, any> { return this.props.traceTimeline; }
  get decisionGraph(): Record<string, any> { return this.props.decisionGraph; }
}

export interface AiPlatformJobProps {
  tenantId: string;
  jobType: string;
  priority: number;
  payloadJson: Record<string, any>;
  status: string;
  runAfter?: Date;
}

export class AiPlatformJob extends AggregateRoot<AiPlatformJobProps> {
  get tenantId(): string { return this.props.tenantId; }
  get jobType(): string { return this.props.jobType; }
  get priority(): number { return this.props.priority; }
  get payloadJson(): Record<string, any> { return this.props.payloadJson; }
  get status(): string { return this.props.status; }
  get runAfter(): Date | undefined { return this.props.runAfter; }
}

export interface McpServerRegistryProps {
  tenantId: string;
  serverName: string;
  endpointUrl: string;
  isEnabled: boolean;
}

export class McpServerRegistry extends AggregateRoot<McpServerRegistryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serverName(): string { return this.props.serverName; }
  get endpointUrl(): string { return this.props.endpointUrl; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface AiMarketplaceExtensionProps {
  tenantId: string;
  extensionName: string;
  publisher: string;
  extensionVersion: string;
  compatibilityJson: Record<string, any>;
  digitalSignature: string;
}

export class AiMarketplaceExtension extends AggregateRoot<AiMarketplaceExtensionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get extensionName(): string { return this.props.extensionName; }
  get publisher(): string { return this.props.publisher; }
  get extensionVersion(): string { return this.props.extensionVersion; }
  get compatibilityJson(): Record<string, any> { return this.props.compatibilityJson; }
  get digitalSignature(): string { return this.props.digitalSignature; }
}

export interface RetrievalEvaluationMetricProps {
  tenantId: string;
  retrievalId: string;
  recallScore: number;
  precisionScore: number;
}

export class RetrievalEvaluationMetric extends AggregateRoot<RetrievalEvaluationMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get retrievalId(): string { return this.props.retrievalId; }
  get recallScore(): number { return this.props.recallScore; }
  get precisionScore(): number { return this.props.precisionScore; }
}

export interface AiEventStoreProps {
  tenantId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventVersion: number;
  payloadJson: Record<string, any>;
  correlationId: string;
  causationId: string;
}

export class AiEventStore extends AggregateRoot<AiEventStoreProps> {
  get tenantId(): string { return this.props.tenantId; }
  get aggregateType(): string { return this.props.aggregateType; }
  get aggregateId(): string { return this.props.aggregateId; }
  get eventType(): string { return this.props.eventType; }
  get eventVersion(): number { return this.props.eventVersion; }
  get payloadJson(): Record<string, any> { return this.props.payloadJson; }
  get correlationId(): string { return this.props.correlationId; }
  get causationId(): string { return this.props.causationId; }
}

export interface AiFeatureStoreProps {
  tenantId: string;
  featureName: string;
  groupName: string;
  valueType: string;
  metadataJson: Record<string, any>;
}

export class AiFeatureStore extends AggregateRoot<AiFeatureStoreProps> {
  get tenantId(): string { return this.props.tenantId; }
  get featureName(): string { return this.props.featureName; }
  get groupName(): string { return this.props.groupName; }
  get valueType(): string { return this.props.valueType; }
  get metadataJson(): Record<string, any> { return this.props.metadataJson; }
}

export interface AiModelDeploymentProps {
  tenantId: string;
  modelId: string;
  deploymentStage: string;
  trafficWeight: number;
  status: string;
}

export class AiModelDeployment extends AggregateRoot<AiModelDeploymentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get modelId(): string { return this.props.modelId; }
  get deploymentStage(): string { return this.props.deploymentStage; }
  get trafficWeight(): number { return this.props.trafficWeight; }
  get status(): string { return this.props.status; }
}

export interface AiEvaluationReportProps {
  tenantId: string;
  evaluationType: string;
  recallScore: number;
  precisionScore: number;
  benchmarkResults: Record<string, any>;
  reportSummary: string;
}

export class AiEvaluationReport extends AggregateRoot<AiEvaluationReportProps> {
  get tenantId(): string { return this.props.tenantId; }
  get evaluationType(): string { return this.props.evaluationType; }
  get recallScore(): number { return this.props.recallScore; }
  get precisionScore(): number { return this.props.precisionScore; }
  get benchmarkResults(): Record<string, any> { return this.props.benchmarkResults; }
  get reportSummary(): string { return this.props.reportSummary; }
}

export interface AiPlatformBudgetProps {
  tenantId: string;
  targetType: string;
  targetId: string;
  cpuLimit: number;
  memoryLimit: number;
  tokenLimit: number;
  timeoutLimit: number;
}

export class AiPlatformBudget extends AggregateRoot<AiPlatformBudgetProps> {
  get tenantId(): string { return this.props.tenantId; }
  get targetType(): string { return this.props.targetType; }
  get targetId(): string { return this.props.targetId; }
  get cpuLimit(): number { return this.props.cpuLimit; }
  get memoryLimit(): number { return this.props.memoryLimit; }
  get tokenLimit(): number { return this.props.tokenLimit; }
  get timeoutLimit(): number { return this.props.timeoutLimit; }
}

export interface AiEncryptedSecretProps {
  tenantId: string;
  secretKey: string;
  encryptedVal: string;
  providerName: string;
}

export class AiEncryptedSecret extends AggregateRoot<AiEncryptedSecretProps> {
  get tenantId(): string { return this.props.tenantId; }
  get secretKey(): string { return this.props.secretKey; }
  get encryptedVal(): string { return this.props.encryptedVal; }
  get providerName(): string { return this.props.providerName; }
}

export interface AiDisasterBackupProps {
  tenantId: string;
  backupType: string;
  backupPath: string;
  sizeBytes: number;
}

export class AiDisasterBackup extends AggregateRoot<AiDisasterBackupProps> {
  get tenantId(): string { return this.props.tenantId; }
  get backupType(): string { return this.props.backupType; }
  get backupPath(): string { return this.props.backupPath; }
  get sizeBytes(): number { return this.props.sizeBytes; }
}

export interface AiVectorSyncJobProps {
  tenantId: string;
  syncType: string;
  compaction: boolean;
  status: string;
}

export class AiVectorSyncJob extends AggregateRoot<AiVectorSyncJobProps> {
  get tenantId(): string { return this.props.tenantId; }
  get syncType(): string { return this.props.syncType; }
  get compaction(): boolean { return this.props.compaction; }
  get status(): string { return this.props.status; }
}



