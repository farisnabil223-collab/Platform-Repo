import { AggregateRoot } from './aggregate-root';

export interface CompliancePolicyProps {
  tenantId: string;
  code: string;
  framework: string;
  contentTemplate: string;
  version: string;
  status: string;
  assignedRoles: string;
}

export class CompliancePolicy extends AggregateRoot<CompliancePolicyProps> {
  constructor(id: string, props: CompliancePolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get code(): string { return this.props.code; }
  get framework(): string { return this.props.framework; }
  get contentTemplate(): string { return this.props.contentTemplate; }
  get policyVersion(): string { return this.props.version; }
  get status(): string { return this.props.status; }
  get assignedRoles(): string { return this.props.assignedRoles; }
}

export interface AuditEntryProps {
  tenantId: string;
  action: string;
  actorId: string;
  payload: any;
  signature: string;
  hashChain: string;
}

export class AuditEntry extends AggregateRoot<AuditEntryProps> {
  constructor(id: string, props: AuditEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get action(): string { return this.props.action; }
  get actorId(): string { return this.props.actorId; }
  get payload(): any { return this.props.payload; }
  get signature(): string { return this.props.signature; }
  get hashChain(): string { return this.props.hashChain; }
}

export interface RiskRegisterItemProps {
  tenantId: string;
  title: string;
  category: string;
  probability: number;
  impact: number;
  score: number;
  residualRisk: number;
  mitigationPlan: string;
  status: string;
}

export class RiskRegisterItem extends AggregateRoot<RiskRegisterItemProps> {
  constructor(id: string, props: RiskRegisterItemProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get category(): string { return this.props.category; }
  get probability(): number { return this.props.probability; }
  get impact(): number { return this.props.impact; }
  get score(): number { return this.props.score; }
  get residualRisk(): number { return this.props.residualRisk; }
  get mitigationPlan(): string { return this.props.mitigationPlan; }
  get status(): string { return this.props.status; }
}

export interface PrivacyRequestProps {
  tenantId: string;
  userId: string;
  requestType: string;
  status: string;
}

export class PrivacyRequest extends AggregateRoot<PrivacyRequestProps> {
  constructor(id: string, props: PrivacyRequestProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get requestType(): string { return this.props.requestType; }
  get status(): string { return this.props.status; }
}

export interface UserConsentHistoryProps {
  tenantId: string;
  userId: string;
  granted: boolean;
  purpose: string;
}

export class UserConsentHistory extends AggregateRoot<UserConsentHistoryProps> {
  constructor(id: string, props: UserConsentHistoryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get granted(): boolean { return this.props.granted; }
  get purpose(): string { return this.props.purpose; }
}
