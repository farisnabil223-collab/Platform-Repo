import { AggregateRoot } from './aggregate-root';

export interface MeshServiceProps {
  tenantId: string;
  serviceName: string;
  mtlsEnabled: boolean;
  status: string;
}

export class MeshService extends AggregateRoot<MeshServiceProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get mtlsEnabled(): boolean { return this.props.mtlsEnabled; }
  get status(): string { return this.props.status; }
}

export interface MeshTrafficPolicyProps {
  tenantId: string;
  serviceId: string;
  circuitBreaker: Record<string, any>;
  retryPolicy: Record<string, any>;
  timeoutMs: number;
  mirrorTarget?: string;
}

export class MeshTrafficPolicy extends AggregateRoot<MeshTrafficPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serviceId(): string { return this.props.serviceId; }
  get circuitBreaker(): Record<string, any> { return this.props.circuitBreaker; }
  get retryPolicy(): Record<string, any> { return this.props.retryPolicy; }
  get timeoutMs(): number { return this.props.timeoutMs; }
  get mirrorTarget(): string | undefined { return this.props.mirrorTarget; }
}

export interface GatewayRouteProps {
  tenantId: string;
  routePath: string;
  apiVersion: string;
  rateLimit: number;
  quotaLimit: number;
  status: string;
}

export class GatewayRoute extends AggregateRoot<GatewayRouteProps> {
  get tenantId(): string { return this.props.tenantId; }
  get routePath(): string { return this.props.routePath; }
  get apiVersion(): string { return this.props.apiVersion; }
  get rateLimit(): number { return this.props.rateLimit; }
  get quotaLimit(): number { return this.props.quotaLimit; }
  get status(): string { return this.props.status; }
}

export interface DynamicConfigProps {
  tenantId: string;
  configKey: string;
  configValue: string;
  isFeatureFlag: boolean;
  version: number;
  environment: string;
}

export class DynamicConfig extends AggregateRoot<DynamicConfigProps> {
  get tenantId(): string { return this.props.tenantId; }
  get configKey(): string { return this.props.configKey; }
  get configValue(): string { return this.props.configValue; }
  get isFeatureFlag(): boolean { return this.props.isFeatureFlag; }
  get configVersion(): number { return this.props.version; }
  get environment(): string { return this.props.environment; }
}

export interface DistributedLockProps {
  tenantId: string;
  lockName: string;
  ownerId: string;
  leaseMs: number;
  acquiredAt: Date;
}

export class DistributedLock extends AggregateRoot<DistributedLockProps> {
  get tenantId(): string { return this.props.tenantId; }
  get lockName(): string { return this.props.lockName; }
  get ownerId(): string { return this.props.ownerId; }
  get leaseMs(): number { return this.props.leaseMs; }
  get acquiredAt(): Date { return this.props.acquiredAt; }
}

export interface DistributedJobProps {
  tenantId: string;
  jobName: string;
  schedule?: string;
  priority: number;
  status: string;
  workerPool: string;
  retryCount: number;
  runAt: Date;
}

export class DistributedJob extends AggregateRoot<DistributedJobProps> {
  get tenantId(): string { return this.props.tenantId; }
  get jobName(): string { return this.props.jobName; }
  get schedule(): string | undefined { return this.props.schedule; }
  get priority(): number { return this.props.priority; }
  get status(): string { return this.props.status; }
  get workerPool(): string { return this.props.workerPool; }
  get retryCount(): number { return this.props.retryCount; }
  get runAt(): Date { return this.props.runAt; }
}

export interface CapacityForecastProps {
  tenantId: string;
  targetDate: Date;
  forecastCpu: number;
  forecastRam: number;
  growthRate: number;
  costEstimate: number;
}

export class CapacityForecast extends AggregateRoot<CapacityForecastProps> {
  get tenantId(): string { return this.props.tenantId; }
  get targetDate(): Date { return this.props.targetDate; }
  get forecastCpu(): number { return this.props.forecastCpu; }
  get forecastRam(): number { return this.props.forecastRam; }
  get growthRate(): number { return this.props.growthRate; }
  get costEstimate(): number { return this.props.costEstimate; }
}

export interface PlatformAuditLogProps {
  tenantId: string;
  auditType: string;
  actionName: string;
  actor: string;
  details: Record<string, any>;
}

export class PlatformAuditLog extends AggregateRoot<PlatformAuditLogProps> {
  get tenantId(): string { return this.props.tenantId; }
  get auditType(): string { return this.props.auditType; }
  get actionName(): string { return this.props.actionName; }
  get actor(): string { return this.props.actor; }
  get details(): Record<string, any> { return this.props.details; }
}

export interface IncidentProps {
  tenantId: string;
  severity: string;
  title: string;
  status: string;
  timeline: Record<string, any>;
  postmortem?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export class Incident extends AggregateRoot<IncidentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get severity(): string { return this.props.severity; }
  get title(): string { return this.props.title; }
  get status(): string { return this.props.status; }
  get timeline(): Record<string, any> { return this.props.timeline; }
  get postmortem(): string | undefined { return this.props.postmortem; }
  get incidentCreatedAt(): Date { return this.props.createdAt; }
  get resolvedAt(): Date | undefined { return this.props.resolvedAt; }
}

export interface RunbookProps {
  tenantId: string;
  name: string;
  procedures: Record<string, any>;
  playbookText: string;
  scriptPath: string;
}

export class Runbook extends AggregateRoot<RunbookProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get procedures(): Record<string, any> { return this.props.procedures; }
  get playbookText(): string { return this.props.playbookText; }
  get scriptPath(): string { return this.props.scriptPath; }
}

export interface OpsCompliancePolicyProps {
  tenantId: string;
  policyName: string;
  policyType: string;
  validationRule: Record<string, any>;
  status: string;
}

export class OpsCompliancePolicy extends AggregateRoot<OpsCompliancePolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyName(): string { return this.props.policyName; }
  get policyType(): string { return this.props.policyType; }
  get validationRule(): Record<string, any> { return this.props.validationRule; }
  get status(): string { return this.props.status; }
}
