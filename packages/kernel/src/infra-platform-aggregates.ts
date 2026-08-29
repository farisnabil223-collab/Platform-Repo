import { AggregateRoot } from './aggregate-root';

export interface CloudRegionProps {
  tenantId: string;
  name: string;
  provider: string;
  status: string;
}

export class CloudRegion extends AggregateRoot<CloudRegionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get provider(): string { return this.props.provider; }
  get status(): string { return this.props.status; }
}

export interface ClusterProps {
  tenantId: string;
  name: string;
  region: string;
  status: string;
  nodeCount: number;
}

export class Cluster extends AggregateRoot<ClusterProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get region(): string { return this.props.region; }
  get status(): string { return this.props.status; }
  get nodeCount(): number { return this.props.nodeCount; }
}

export interface ClusterNodeProps {
  tenantId: string;
  clusterId: string;
  name: string;
  role: string;
  status: string;
}

export class ClusterNode extends AggregateRoot<ClusterNodeProps> {
  get tenantId(): string { return this.props.tenantId; }
  get clusterId(): string { return this.props.clusterId; }
  get name(): string { return this.props.name; }
  get role(): string { return this.props.role; }
  get status(): string { return this.props.status; }
}

export interface AvailabilityZoneProps {
  tenantId: string;
  name: string;
  region: string;
  status: string;
}

export class AvailabilityZone extends AggregateRoot<AvailabilityZoneProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get region(): string { return this.props.region; }
  get status(): string { return this.props.status; }
}

export interface DeploymentEnvironmentProps {
  tenantId: string;
  name: string;
  status: string;
}

export class DeploymentEnvironment extends AggregateRoot<DeploymentEnvironmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get status(): string { return this.props.status; }
}

export interface InfrastructureProviderProps {
  tenantId: string;
  name: string;
  status: string;
  credentials: Record<string, any>;
}

export class InfrastructureProvider extends AggregateRoot<InfrastructureProviderProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get status(): string { return this.props.status; }
  get credentials(): Record<string, any> { return this.props.credentials; }
}

export interface GlobalLoadBalancerProps {
  tenantId: string;
  name: string;
  dnsName: string;
  routing: string;
  status: string;
}

export class GlobalLoadBalancer extends AggregateRoot<GlobalLoadBalancerProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get dnsName(): string { return this.props.dnsName; }
  get routing(): string { return this.props.routing; }
  get status(): string { return this.props.status; }
}

export interface TrafficPolicyProps {
  tenantId: string;
  name: string;
  policyJson: Record<string, any>;
}

export class TrafficPolicy extends AggregateRoot<TrafficPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get policyJson(): Record<string, any> { return this.props.policyJson; }
}

export interface GeoRoutingRuleProps {
  tenantId: string;
  country: string;
  regionName: string;
  targetUrl: string;
}

export class GeoRoutingRule extends AggregateRoot<GeoRoutingRuleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get country(): string { return this.props.country; }
  get regionName(): string { return this.props.regionName; }
  get targetUrl(): string { return this.props.targetUrl; }
}

export interface DisasterRecoveryPlanProps {
  tenantId: string;
  name: string;
  rpoMinutes: number;
  rtoMinutes: number;
  stepsJson: Record<string, any>;
  isActive: boolean;
}

export class DisasterRecoveryPlan extends AggregateRoot<DisasterRecoveryPlanProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get rpoMinutes(): number { return this.props.rpoMinutes; }
  get rtoMinutes(): number { return this.props.rtoMinutes; }
  get stepsJson(): Record<string, any> { return this.props.stepsJson; }
  get isActive(): boolean { return this.props.isActive; }
}

export interface RecoveryExecutionProps {
  tenantId: string;
  planId: string;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
}

export class RecoveryExecution extends AggregateRoot<RecoveryExecutionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get planId(): string { return this.props.planId; }
  get status(): string { return this.props.status; }
  get startedAt(): Date { return this.props.startedAt; }
  get finishedAt(): Date | undefined { return this.props.finishedAt; }
}

export interface BackupPolicyProps {
  tenantId: string;
  name: string;
  schedule: string;
  retention: number;
}

export class BackupPolicy extends AggregateRoot<BackupPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get schedule(): string { return this.props.schedule; }
  get retention(): number { return this.props.retention; }
}

export interface RestoreOperationProps {
  tenantId: string;
  snapshotId: string;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
}

export class RestoreOperation extends AggregateRoot<RestoreOperationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get snapshotId(): string { return this.props.snapshotId; }
  get status(): string { return this.props.status; }
  get startedAt(): Date { return this.props.startedAt; }
  get finishedAt(): Date | undefined { return this.props.finishedAt; }
}

export interface InfrastructureHealthProps {
  tenantId: string;
  resource: string;
  status: string;
  checkedAt: Date;
}

export class InfrastructureHealth extends AggregateRoot<InfrastructureHealthProps> {
  get tenantId(): string { return this.props.tenantId; }
  get resource(): string { return this.props.resource; }
  get status(): string { return this.props.status; }
  get checkedAt(): Date { return this.props.checkedAt; }
}

export interface InfrastructureAlertProps {
  tenantId: string;
  severity: string;
  message: string;
  isResolved: boolean;
}

export class InfrastructureAlert extends AggregateRoot<InfrastructureAlertProps> {
  get tenantId(): string { return this.props.tenantId; }
  get severity(): string { return this.props.severity; }
  get message(): string { return this.props.message; }
  get isResolved(): boolean { return this.props.isResolved; }
}

export interface InfrastructureMetricProps {
  tenantId: string;
  metricName: string;
  metricValue: number;
  recordedAt: Date;
}

export class InfrastructureMetric extends AggregateRoot<InfrastructureMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get metricName(): string { return this.props.metricName; }
  get metricValue(): number { return this.props.metricValue; }
  get recordedAt(): Date { return this.props.recordedAt; }
}

export interface ServiceEndpointProps {
  tenantId: string;
  serviceName: string;
  url: string;
  region: string;
  status: string;
}

export class ServiceEndpoint extends AggregateRoot<ServiceEndpointProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get url(): string { return this.props.url; }
  get region(): string { return this.props.region; }
  get status(): string { return this.props.status; }
}

export interface ServiceDiscoveryRecordProps {
  tenantId: string;
  serviceName: string;
  ipAddress: string;
  port: number;
  status: string;
}

export class ServiceDiscoveryRecord extends AggregateRoot<ServiceDiscoveryRecordProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get ipAddress(): string { return this.props.ipAddress; }
  get port(): number { return this.props.port; }
  get status(): string { return this.props.status; }
}

export interface InfrastructureCertificateProps {
  tenantId: string;
  domainName: string;
  expiresAt: Date;
  status: string;
}

export class InfrastructureCertificate extends AggregateRoot<InfrastructureCertificateProps> {
  get tenantId(): string { return this.props.tenantId; }
  get domainName(): string { return this.props.domainName; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get status(): string { return this.props.status; }
}
