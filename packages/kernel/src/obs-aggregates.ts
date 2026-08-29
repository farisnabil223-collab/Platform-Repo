import { AggregateRoot } from './aggregate-root';

export interface ObservabilityTraceSpanProps {
  tenantId: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  serviceName: string;
  operationName: string;
  durationMs: number;
  statusCode: number;
  metaJson: Record<string, any>;
}

export class ObservabilityTraceSpan extends AggregateRoot<ObservabilityTraceSpanProps> {
  constructor(id: string, props: ObservabilityTraceSpanProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get traceId(): string { return this.props.traceId; }
  get spanId(): string { return this.props.spanId; }
  get parentSpanId(): string | undefined { return this.props.parentSpanId; }
  get serviceName(): string { return this.props.serviceName; }
  get operationName(): string { return this.props.operationName; }
  get durationMs(): number { return this.props.durationMs; }
  get statusCode(): number { return this.props.statusCode; }
  get metaJson(): Record<string, any> { return this.props.metaJson; }
}

export interface SystemLogEntryProps {
  tenantId: string;
  externalLogId?: string;
  provider?: string;
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  serviceName: string;
  level: string;
  category: string;
  message: string;
  metaJson: Record<string, any>;
}

export class SystemLogEntry extends AggregateRoot<SystemLogEntryProps> {
  constructor(id: string, props: SystemLogEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get externalLogId(): string | undefined { return this.props.externalLogId; }
  get provider(): string { return this.props.provider ?? 'LOCAL'; }
  get traceId(): string | undefined { return this.props.traceId; }
  get spanId(): string | undefined { return this.props.spanId; }
  get correlationId(): string | undefined { return this.props.correlationId; }
  get serviceName(): string { return this.props.serviceName; }
  get level(): string { return this.props.level; }
  get category(): string { return this.props.category; }
  get message(): string { return this.props.message; }
  get metaJson(): Record<string, any> { return this.props.metaJson; }
}

export interface ServiceHealthProbeProps {
  tenantId: string;
  serviceName: string;
  probeType: string;
  status: string;
  latencyMs: number;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  successRate?: number;
  failureCount?: number;
  averageLatency?: number;
  nextScheduledExecution?: Date;
  detailsJson: Record<string, any>;
}

export class ServiceHealthProbe extends AggregateRoot<ServiceHealthProbeProps> {
  constructor(id: string, props: ServiceHealthProbeProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get probeType(): string { return this.props.probeType; }
  get status(): string { return this.props.status; }
  get latencyMs(): number { return this.props.latencyMs; }
  get lastSuccessAt(): Date | undefined { return this.props.lastSuccessAt; }
  get lastFailureAt(): Date | undefined { return this.props.lastFailureAt; }
  get successRate(): number { return this.props.successRate ?? 100.0; }
  get failureCount(): number { return this.props.failureCount ?? 0; }
  get averageLatency(): number { return this.props.averageLatency ?? this.props.latencyMs; }
  get nextScheduledExecution(): Date | undefined { return this.props.nextScheduledExecution; }
  get detailsJson(): Record<string, any> { return this.props.detailsJson; }
}

export interface PlatformMetricProps {
  tenantId: string;
  metricName: string;
  metricType: string;
  value: number;
  metricUnit?: string;
  metricSource?: string;
  metricLabels: Record<string, any>;
  aggregationWindow?: string;
  aggregationMethod?: string;
}

export class PlatformMetric extends AggregateRoot<PlatformMetricProps> {
  constructor(id: string, props: PlatformMetricProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get metricName(): string { return this.props.metricName; }
  get metricType(): string { return this.props.metricType; }
  get value(): number { return this.props.value; }
  get metricUnit(): string { return this.props.metricUnit ?? 'count'; }
  get metricSource(): string { return this.props.metricSource ?? 'SYSTEM'; }
  get metricLabels(): Record<string, any> { return this.props.metricLabels; }
  get aggregationWindow(): string { return this.props.aggregationWindow ?? '1m'; }
  get aggregationMethod(): string { return this.props.aggregationMethod ?? 'AVG'; }
}

export interface SreServiceLevelProps {
  tenantId: string;
  serviceName: string;
  sliTarget: number;
  sloThreshold: number;
  slaTarget: number;
  errorBudgetRemaining?: number;
  periodDays?: number;
}

export class SreServiceLevel extends AggregateRoot<SreServiceLevelProps> {
  constructor(id: string, props: SreServiceLevelProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get sliTarget(): number { return this.props.sliTarget; }
  get sloThreshold(): number { return this.props.sloThreshold; }
  get slaTarget(): number { return this.props.slaTarget; }
  get errorBudgetRemaining(): number { return this.props.errorBudgetRemaining ?? 100.0; }
  get periodDays(): number { return this.props.periodDays ?? 30; }
}

export interface IncidentRecordProps {
  tenantId: string;
  title: string;
  severity: string;
  status: string;
  assigneeEmail?: string;
  impactLevel?: string;
  detectedBy?: string;
  affectedServices: string[];
  rootCauseStatus?: string;
  mitigationStatus?: string;
  recoveryDuration?: number;
  postMortemCompleted?: boolean;
  timelineJson: Record<string, any>;
  rcaSummary?: string;
  resolvedAt?: Date;
}

export class IncidentRecord extends AggregateRoot<IncidentRecordProps> {
  constructor(id: string, props: IncidentRecordProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get severity(): string { return this.props.severity; }
  get status(): string { return this.props.status; }
  get assigneeEmail(): string | undefined { return this.props.assigneeEmail; }
  get impactLevel(): string { return this.props.impactLevel ?? 'MEDIUM'; }
  get detectedBy(): string { return this.props.detectedBy ?? 'MONITORING'; }
  get affectedServices(): string[] { return this.props.affectedServices; }
  get rootCauseStatus(): string { return this.props.rootCauseStatus ?? 'PENDING'; }
  get mitigationStatus(): string { return this.props.mitigationStatus ?? 'PENDING'; }
  get recoveryDuration(): number | undefined { return this.props.recoveryDuration; }
  get postMortemCompleted(): boolean { return this.props.postMortemCompleted ?? false; }
  get timelineJson(): Record<string, any> { return this.props.timelineJson; }
  get rcaSummary(): string | undefined { return this.props.rcaSummary; }
  get resolvedAt(): Date | undefined { return this.props.resolvedAt; }
}

export interface DevOpsDeploymentProps {
  tenantId: string;
  releaseVersion: string;
  strategy?: string;
  status: string;
  approvalStatus?: string;
  releaseNotes?: string;
  environment?: string;
  artifactVersion?: string;
  commitHash?: string;
  pipelineId?: string;
  deploymentDuration?: number;
  triggeredBy?: string;
  rollbackReason?: string;
}

export class DevOpsDeployment extends AggregateRoot<DevOpsDeploymentProps> {
  constructor(id: string, props: DevOpsDeploymentProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get releaseVersion(): string { return this.props.releaseVersion; }
  get strategy(): string { return this.props.strategy ?? 'DIRECT'; }
  get status(): string { return this.props.status; }
  get approvalStatus(): string { return this.props.approvalStatus ?? 'APPROVED'; }
  get releaseNotes(): string | undefined { return this.props.releaseNotes; }
  get environment(): string { return this.props.environment ?? 'PRODUCTION'; }
  get artifactVersion(): string | undefined { return this.props.artifactVersion; }
  get commitHash(): string | undefined { return this.props.commitHash; }
  get pipelineId(): string | undefined { return this.props.pipelineId; }
  get deploymentDuration(): number | undefined { return this.props.deploymentDuration; }
  get triggeredBy(): string | undefined { return this.props.triggeredBy; }
  get rollbackReason(): string | undefined { return this.props.rollbackReason; }
}

export interface FeatureFlagSettingProps {
  tenantId: string;
  flagKey: string;
  isEnabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  targetAudience: Record<string, any>;
  environment?: string;
  expiresAt?: Date;
  createdBy?: string;
  approvedBy?: string;
  rulesJson: Record<string, any>;
}

export class FeatureFlagSetting extends AggregateRoot<FeatureFlagSettingProps> {
  constructor(id: string, props: FeatureFlagSettingProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get flagKey(): string { return this.props.flagKey; }
  get isEnabled(): boolean { return this.props.isEnabled; }
  get description(): string | undefined { return this.props.description; }
  get rolloutPercentage(): number { return this.props.rolloutPercentage ?? 100.0; }
  get targetAudience(): Record<string, any> { return this.props.targetAudience; }
  get environment(): string { return this.props.environment ?? 'GLOBAL'; }
  get expiresAt(): Date | undefined { return this.props.expiresAt; }
  get flagCreatedBy(): string | undefined { return this.props.createdBy; }
  get approvedBy(): string | undefined { return this.props.approvedBy; }
  get rulesJson(): Record<string, any> { return this.props.rulesJson; }
}

export interface PlatformMaintenanceProps {
  tenantId: string;
  isMaintenanceActive: boolean;
  reason?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
}

export class PlatformMaintenance extends AggregateRoot<PlatformMaintenanceProps> {
  constructor(id: string, props: PlatformMaintenanceProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get isMaintenanceActive(): boolean { return this.props.isMaintenanceActive; }
  get reason(): string | undefined { return this.props.reason; }
  get scheduledStart(): Date { return this.props.scheduledStart; }
  get scheduledEnd(): Date { return this.props.scheduledEnd; }
}

export interface ClusterNodeStatusProps {
  tenantId: string;
  nodeId: string;
  nodeRole: string;
  cpuUsage: number;
  memoryUsage: number;
  status: string;
  diskUsage?: number;
  networkUsage?: number;
  podCount?: number;
  containerCount?: number;
  region?: string;
  availabilityZone?: string;
  lastHeartbeat?: Date;
}

export class ClusterNodeStatus extends AggregateRoot<ClusterNodeStatusProps> {
  constructor(id: string, props: ClusterNodeStatusProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get nodeId(): string { return this.props.nodeId; }
  get nodeRole(): string { return this.props.nodeRole; }
  get cpuUsage(): number { return this.props.cpuUsage; }
  get memoryUsage(): number { return this.props.memoryUsage; }
  get status(): string { return this.props.status; }
  get diskUsage(): number { return this.props.diskUsage ?? 0.0; }
  get networkUsage(): number { return this.props.networkUsage ?? 0.0; }
  get podCount(): number { return this.props.podCount ?? 0; }
  get containerCount(): number { return this.props.containerCount ?? 0; }
  get region(): string { return this.props.region ?? 'us-east-1'; }
  get availabilityZone(): string { return this.props.availabilityZone ?? 'us-east-1a'; }
  get lastHeartbeat(): Date { return this.props.lastHeartbeat ?? new Date(); }
}

export interface ServiceRegistryEntryProps {
  tenantId: string;
  serviceName: string;
  endpointUrl: string;
  version: string;
  status: string;
}

export class ServiceRegistryEntry extends AggregateRoot<ServiceRegistryEntryProps> {
  constructor(id: string, props: ServiceRegistryEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get endpointUrl(): string { return this.props.endpointUrl; }
  get serviceVersion(): string { return this.props.version; }
  get status(): string { return this.props.status; }
}

export interface SecurityEventLogProps {
  tenantId: string;
  eventType: string;
  severity: string;
  actorEmail?: string;
  ipAddress?: string;
  geoLocation?: string;
  userAgent?: string;
  riskScore?: number;
  mitreTechnique?: string;
  actionTaken?: string;
  detailsJson: Record<string, any>;
}

export class SecurityEventLog extends AggregateRoot<SecurityEventLogProps> {
  constructor(id: string, props: SecurityEventLogProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get eventType(): string { return this.props.eventType; }
  get severity(): string { return this.props.severity; }
  get actorEmail(): string | undefined { return this.props.actorEmail; }
  get ipAddress(): string | undefined { return this.props.ipAddress; }
  get geoLocation(): string | undefined { return this.props.geoLocation; }
  get userAgent(): string | undefined { return this.props.userAgent; }
  get riskScore(): number { return this.props.riskScore ?? 0.0; }
  get mitreTechnique(): string | undefined { return this.props.mitreTechnique; }
  get actionTaken(): string | undefined { return this.props.actionTaken; }
  get detailsJson(): Record<string, any> { return this.props.detailsJson; }
}

// ALERTING ENGINE AGGREGATES

export interface ObsAlertRuleProps {
  tenantId: string;
  ruleName: string;
  metricName: string;
  condition?: string;
  threshold: number;
  severity?: string;
  isEnabled?: boolean;
}

export class ObsAlertRule extends AggregateRoot<ObsAlertRuleProps> {
  constructor(id: string, props: ObsAlertRuleProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get ruleName(): string { return this.props.ruleName; }
  get metricName(): string { return this.props.metricName; }
  get condition(): string { return this.props.condition ?? 'GREATER_THAN'; }
  get threshold(): number { return this.props.threshold; }
  get severity(): string { return this.props.severity ?? 'WARNING'; }
  get isEnabled(): boolean { return this.props.isEnabled ?? true; }
}

export interface AlertPolicyProps {
  tenantId: string;
  policyName: string;
  escalationDelayMinutes?: number;
  repeatIntervalMinutes?: number;
}

export class AlertPolicy extends AggregateRoot<AlertPolicyProps> {
  constructor(id: string, props: AlertPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get policyName(): string { return this.props.policyName; }
  get escalationDelayMinutes(): number { return this.props.escalationDelayMinutes ?? 15; }
  get repeatIntervalMinutes(): number { return this.props.repeatIntervalMinutes ?? 60; }
}

export interface AlertChannelProps {
  tenantId: string;
  channelName: string;
  channelType: string;
  configJson: Record<string, any>;
}

export class AlertChannel extends AggregateRoot<AlertChannelProps> {
  constructor(id: string, props: AlertChannelProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get channelName(): string { return this.props.channelName; }
  get channelType(): string { return this.props.channelType; }
  get configJson(): Record<string, any> { return this.props.configJson; }
}

export interface AlertSubscriptionProps {
  tenantId: string;
  ruleId: string;
  channelId: string;
  isEnabled?: boolean;
}

export class AlertSubscription extends AggregateRoot<AlertSubscriptionProps> {
  constructor(id: string, props: AlertSubscriptionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get ruleId(): string { return this.props.ruleId; }
  get channelId(): string { return this.props.channelId; }
  get isEnabled(): boolean { return this.props.isEnabled ?? true; }
}

export interface AlertHistoryProps {
  tenantId: string;
  ruleId: string;
  metricValue: number;
  triggerReason: string;
  status?: string;
  firedAt?: Date;
  resolvedAt?: Date;
}

export class AlertHistory extends AggregateRoot<AlertHistoryProps> {
  constructor(id: string, props: AlertHistoryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get ruleId(): string { return this.props.ruleId; }
  get metricValue(): number { return this.props.metricValue; }
  get triggerReason(): string { return this.props.triggerReason; }
  get status(): string { return this.props.status ?? 'TRIGGERED'; }
  get firedAt(): Date { return this.props.firedAt ?? new Date(); }
  get resolvedAt(): Date | undefined { return this.props.resolvedAt; }
}

export interface AlertEscalationProps {
  tenantId: string;
  historyId: string;
  level?: number;
  assigneeEmail: string;
  status?: string;
  escalatedAt?: Date;
}

export class AlertEscalation extends AggregateRoot<AlertEscalationProps> {
  constructor(id: string, props: AlertEscalationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get historyId(): string { return this.props.historyId; }
  get level(): number { return this.props.level ?? 1; }
  get assigneeEmail(): string { return this.props.assigneeEmail; }
  get status(): string { return this.props.status ?? 'ESCALATED'; }
  get escalatedAt(): Date { return this.props.escalatedAt ?? new Date(); }
}

export interface ObsNotificationTemplateProps {
  tenantId: string;
  name: string;
  channelType: string;
  subjectTemplate: string;
  bodyTemplate: string;
}

export class ObsNotificationTemplate extends AggregateRoot<ObsNotificationTemplateProps> {
  constructor(id: string, props: ObsNotificationTemplateProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get channelType(): string { return this.props.channelType; }
  get subjectTemplate(): string { return this.props.subjectTemplate; }
  get bodyTemplate(): string { return this.props.bodyTemplate; }
}
