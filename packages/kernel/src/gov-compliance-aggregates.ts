import { AggregateRoot } from './aggregate-root';

export interface GovernancePolicyVersionProps {
  tenantId: string;
  policyId: string;
  policyVersion: string;
  content: string;
  status: string;
}

export class GovernancePolicyVersion extends AggregateRoot<GovernancePolicyVersionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyId(): string { return this.props.policyId; }
  get policyVersion(): string { return this.props.policyVersion; }
  get content(): string { return this.props.content; }
  get status(): string { return this.props.status; }
}

export interface GovernanceApprovalWorkflowProps {
  tenantId: string;
  targetType: string;
  targetId: string;
  status: string;
  approver: string;
}

export class GovernanceApprovalWorkflow extends AggregateRoot<GovernanceApprovalWorkflowProps> {
  get tenantId(): string { return this.props.tenantId; }
  get targetType(): string { return this.props.targetType; }
  get targetId(): string { return this.props.targetId; }
  get status(): string { return this.props.status; }
  get approver(): string { return this.props.approver; }
}

export interface ComplianceFrameworkProps {
  tenantId: string;
  name: string;
  description: string;
  frameworkVersion: string;
}

export class ComplianceFramework extends AggregateRoot<ComplianceFrameworkProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get frameworkVersion(): string { return this.props.frameworkVersion; }
}

export interface ComplianceControlProps {
  tenantId: string;
  frameworkId: string;
  controlCode: string;
  title: string;
  status: string;
}

export class ComplianceControl extends AggregateRoot<ComplianceControlProps> {
  get tenantId(): string { return this.props.tenantId; }
  get frameworkId(): string { return this.props.frameworkId; }
  get controlCode(): string { return this.props.controlCode; }
  get title(): string { return this.props.title; }
  get status(): string { return this.props.status; }
}

export interface ComplianceAssessmentProps {
  tenantId: string;
  frameworkId: string;
  score: number;
  status: string;
}

export class ComplianceAssessment extends AggregateRoot<ComplianceAssessmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get frameworkId(): string { return this.props.frameworkId; }
  get score(): number { return this.props.score; }
  get status(): string { return this.props.status; }
}

export interface ComplianceViolationProps {
  tenantId: string;
  controlId: string;
  description: string;
  severity: string;
}

export class ComplianceViolation extends AggregateRoot<ComplianceViolationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get controlId(): string { return this.props.controlId; }
  get description(): string { return this.props.description; }
  get severity(): string { return this.props.severity; }
}

export interface ComplianceAuditProps {
  tenantId: string;
  auditor: string;
  scope: Record<string, any>;
  status: string;
}

export class ComplianceAudit extends AggregateRoot<ComplianceAuditProps> {
  get tenantId(): string { return this.props.tenantId; }
  get auditor(): string { return this.props.auditor; }
  get scope(): Record<string, any> { return this.props.scope; }
  get status(): string { return this.props.status; }
}

export interface PrivacyConsentProps {
  tenantId: string;
  userId: string;
  consentType: string;
  isGranted: boolean;
}

export class PrivacyConsent extends AggregateRoot<PrivacyConsentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get consentType(): string { return this.props.consentType; }
  get isGranted(): boolean { return this.props.isGranted; }
}

export interface DataClassificationProps {
  tenantId: string;
  assetId: string;
  level: string;
  reason: string;
}

export class DataClassification extends AggregateRoot<DataClassificationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get assetId(): string { return this.props.assetId; }
  get level(): string { return this.props.level; }
  get reason(): string { return this.props.reason; }
}

export interface DataCatalogProps {
  tenantId: string;
  name: string;
  description: string;
}

export class DataCatalog extends AggregateRoot<DataCatalogProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
}

export interface DataAssetProps {
  tenantId: string;
  catalogId: string;
  name: string;
  assetType: string;
}

export class DataAsset extends AggregateRoot<DataAssetProps> {
  get tenantId(): string { return this.props.tenantId; }
  get catalogId(): string { return this.props.catalogId; }
  get name(): string { return this.props.name; }
  get assetType(): string { return this.props.assetType; }
}

export interface DataLineageProps {
  tenantId: string;
  sourceAsset: string;
  targetAsset: string;
  flowDetails: string;
}

export class DataLineage extends AggregateRoot<DataLineageProps> {
  get tenantId(): string { return this.props.tenantId; }
  get sourceAsset(): string { return this.props.sourceAsset; }
  get targetAsset(): string { return this.props.targetAsset; }
  get flowDetails(): string { return this.props.flowDetails; }
}

export interface DataOwnerProps {
  tenantId: string;
  assetId: string;
  ownerEmail: string;
}

export class DataOwner extends AggregateRoot<DataOwnerProps> {
  get tenantId(): string { return this.props.tenantId; }
  get assetId(): string { return this.props.assetId; }
  get ownerEmail(): string { return this.props.ownerEmail; }
}

export interface DataStewardProps {
  tenantId: string;
  assetId: string;
  stewardEmail: string;
}

export class DataSteward extends AggregateRoot<DataStewardProps> {
  get tenantId(): string { return this.props.tenantId; }
  get assetId(): string { return this.props.assetId; }
  get stewardEmail(): string { return this.props.stewardEmail; }
}

export interface MetadataRegistryProps {
  tenantId: string;
  assetId: string;
  metaKey: string;
  metaValue: string;
}

export class MetadataRegistry extends AggregateRoot<MetadataRegistryProps> {
  get tenantId(): string { return this.props.tenantId; }
  get assetId(): string { return this.props.assetId; }
  get metaKey(): string { return this.props.metaKey; }
  get metaValue(): string { return this.props.metaValue; }
}

export interface RetentionScheduleProps {
  tenantId: string;
  policyId: string;
  nextPurgeAt: Date;
  status: string;
}

export class RetentionSchedule extends AggregateRoot<RetentionScheduleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyId(): string { return this.props.policyId; }
  get nextPurgeAt(): Date { return this.props.nextPurgeAt; }
  get status(): string { return this.props.status; }
}

export interface LegalHoldProps {
  tenantId: string;
  caseName: string;
  targetType: string;
  targetId: string;
  isActive: boolean;
}

export class LegalHold extends AggregateRoot<LegalHoldProps> {
  get tenantId(): string { return this.props.tenantId; }
  get caseName(): string { return this.props.caseName; }
  get targetType(): string { return this.props.targetType; }
  get targetId(): string { return this.props.targetId; }
  get isActive(): boolean { return this.props.isActive; }
}

export interface DataResidencyRuleProps {
  tenantId: string;
  regionCode: string;
  storagePath: string;
  isEnforced: boolean;
}

export class DataResidencyRule extends AggregateRoot<DataResidencyRuleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get regionCode(): string { return this.props.regionCode; }
  get storagePath(): string { return this.props.storagePath; }
  get isEnforced(): boolean { return this.props.isEnforced; }
}

export interface DataTransferPolicyProps {
  tenantId: string;
  sourceRegion: string;
  targetRegion: string;
  transferCheck: string;
}

export class DataTransferPolicy extends AggregateRoot<DataTransferPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get sourceRegion(): string { return this.props.sourceRegion; }
  get targetRegion(): string { return this.props.targetRegion; }
  get transferCheck(): string { return this.props.transferCheck; }
}

export interface RiskRegisterProps {
  tenantId: string;
  title: string;
  description: string;
  status: string;
}

export class RiskRegister extends AggregateRoot<RiskRegisterProps> {
  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get description(): string { return this.props.description; }
  get status(): string { return this.props.status; }
}

export interface RiskMitigationProps {
  tenantId: string;
  riskId: string;
  planDetails: string;
  costLimit: number;
  status: string;
}

export class RiskMitigation extends AggregateRoot<RiskMitigationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get riskId(): string { return this.props.riskId; }
  get planDetails(): string { return this.props.planDetails; }
  get costLimit(): number { return this.props.costLimit; }
  get status(): string { return this.props.status; }
}

export interface RiskControlProps {
  tenantId: string;
  riskId: string;
  controlCode: string;
  isEffective: boolean;
}

export class RiskControl extends AggregateRoot<RiskControlProps> {
  get tenantId(): string { return this.props.tenantId; }
  get riskId(): string { return this.props.riskId; }
  get controlCode(): string { return this.props.controlCode; }
  get isEffective(): boolean { return this.props.isEffective; }
}

export interface BusinessImpactAssessmentProps {
  tenantId: string;
  serviceName: string;
  rtoMinutes: number;
  rpoMinutes: number;
  criticality: string;
}

export class BusinessImpactAssessment extends AggregateRoot<BusinessImpactAssessmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get serviceName(): string { return this.props.serviceName; }
  get rtoMinutes(): number { return this.props.rtoMinutes; }
  get rpoMinutes(): number { return this.props.rpoMinutes; }
  get criticality(): string { return this.props.criticality; }
}

export interface ExceptionRequestProps {
  tenantId: string;
  policyId: string;
  reason: string;
  expiresAt: Date;
  status: string;
}

export class ExceptionRequest extends AggregateRoot<ExceptionRequestProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyId(): string { return this.props.policyId; }
  get reason(): string { return this.props.reason; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get status(): string { return this.props.status; }
}

export interface ControlReviewProps {
  tenantId: string;
  controlId: string;
  status: string;
  reviewer: string;
}

export class ControlReview extends AggregateRoot<ControlReviewProps> {
  get tenantId(): string { return this.props.tenantId; }
  get controlId(): string { return this.props.controlId; }
  get status(): string { return this.props.status; }
  get reviewer(): string { return this.props.reviewer; }
}

export interface ComplianceDashboardProps {
  tenantId: string;
  frameworkCount: number;
  controlCount: number;
  violationCount: number;
  openRiskCount: number;
}

export class ComplianceDashboard extends AggregateRoot<ComplianceDashboardProps> {
  get tenantId(): string { return this.props.tenantId; }
  get frameworkCount(): number { return this.props.frameworkCount; }
  get controlCount(): number { return this.props.controlCount; }
  get violationCount(): number { return this.props.violationCount; }
  get openRiskCount(): number { return this.props.openRiskCount; }
}
