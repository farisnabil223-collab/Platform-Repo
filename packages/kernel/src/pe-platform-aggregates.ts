import { AggregateRoot } from './aggregate-root';

export interface DevPortalAppProps {
  tenantId: string;
  appName: string;
  templateId: string;
  status: string;
}

export class DevPortalApp extends AggregateRoot<DevPortalAppProps> {
  get tenantId(): string { return this.props.tenantId; }
  get appName(): string { return this.props.appName; }
  get templateId(): string { return this.props.templateId; }
  get status(): string { return this.props.status; }
}

export interface GitOpsAppProps {
  tenantId: string;
  repoUrl: string;
  targetBranch: string;
  syncStatus: string;
  driftDetected: boolean;
}

export class GitOpsApp extends AggregateRoot<GitOpsAppProps> {
  get tenantId(): string { return this.props.tenantId; }
  get repoUrl(): string { return this.props.repoUrl; }
  get targetBranch(): string { return this.props.targetBranch; }
  get syncStatus(): string { return this.props.syncStatus; }
  get driftDetected(): boolean { return this.props.driftDetected; }
}

export interface ReleaseTrainProps {
  tenantId: string;
  trainName: string;
  status: string;
  releaseDate: Date;
}

export class ReleaseTrain extends AggregateRoot<ReleaseTrainProps> {
  get tenantId(): string { return this.props.tenantId; }
  get trainName(): string { return this.props.trainName; }
  get status(): string { return this.props.status; }
  get releaseDate(): Date { return this.props.releaseDate; }
}

export interface DeploymentPipelineProps {
  tenantId: string;
  pipelineName: string;
  activeStage: string;
  gatesStatus: string;
}

export class DeploymentPipeline extends AggregateRoot<DeploymentPipelineProps> {
  get tenantId(): string { return this.props.tenantId; }
  get pipelineName(): string { return this.props.pipelineName; }
  get activeStage(): string { return this.props.activeStage; }
  get gatesStatus(): string { return this.props.gatesStatus; }
}

export interface PlatformScorecardProps {
  tenantId: string;
  reliability: number;
  availability: number;
  performance: number;
  security: number;
  compliance: number;
  operational: number;
}

export class PlatformScorecard extends AggregateRoot<PlatformScorecardProps> {
  get tenantId(): string { return this.props.tenantId; }
  get reliability(): number { return this.props.reliability; }
  get availability(): number { return this.props.availability; }
  get performance(): number { return this.props.performance; }
  get security(): number { return this.props.security; }
  get compliance(): number { return this.props.compliance; }
  get operational(): number { return this.props.operational; }
}

export interface FinOpsAllocationProps {
  tenantId: string;
  costCenter: string;
  chargeback: number;
  showback: number;
  budgetLimit: number;
}

export class FinOpsAllocation extends AggregateRoot<FinOpsAllocationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get costCenter(): string { return this.props.costCenter; }
  get chargeback(): number { return this.props.chargeback; }
  get showback(): number { return this.props.showback; }
  get budgetLimit(): number { return this.props.budgetLimit; }
}

export interface SloTrackerProps {
  tenantId: string;
  sliName: string;
  sloTarget: number;
  errorBudget: number;
  burnRate: number;
}

export class SloTracker extends AggregateRoot<SloTrackerProps> {
  get tenantId(): string { return this.props.tenantId; }
  get sliName(): string { return this.props.sliName; }
  get sloTarget(): number { return this.props.sloTarget; }
  get errorBudget(): number { return this.props.errorBudget; }
  get burnRate(): number { return this.props.burnRate; }
}

export interface ResilienceDependencyProps {
  tenantId: string;
  serviceName: string;
  dependsOn: string;
  blastRadius: number;
  criticalLevel: string;
}

export class ResilienceDependency extends AggregateRoot<ResilienceDependencyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get dependsOn(): string { return this.props.dependsOn; }
  get blastRadius(): number { return this.props.blastRadius; }
  get criticalLevel(): string { return this.props.criticalLevel; }
}

export interface PlatformInventoryProps {
  tenantId: string;
  clusterCount: number;
  serviceCount: number;
  runbookCount: number;
}

export class PlatformInventory extends AggregateRoot<PlatformInventoryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get clusterCount(): number { return this.props.clusterCount; }
  get serviceCount(): number { return this.props.serviceCount; }
  get runbookCount(): number { return this.props.runbookCount; }
}
