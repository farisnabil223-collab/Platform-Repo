import { DomainEvent } from './domain-event';

export class PolicyApproved extends DomainEvent {
  constructor(
    public readonly policyId: string,
    public readonly title: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ControlFailed extends DomainEvent {
  constructor(
    public readonly controlId: string,
    public readonly description: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ConsentUpdated extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly consentType: string,
    public readonly isGranted: boolean,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class PrivacyRequestCompleted extends DomainEvent {
  constructor(
    public readonly requestId: string,
    public readonly requestType: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class RetentionPurged extends DomainEvent {
  constructor(
    public readonly policyId: string,
    public readonly dataType: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class LegalHoldReleased extends DomainEvent {
  constructor(
    public readonly holdId: string,
    public readonly caseName: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class RiskMitigated extends DomainEvent {
  constructor(
    public readonly riskId: string,
    public readonly mitigationPlanId: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}
