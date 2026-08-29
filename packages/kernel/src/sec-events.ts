import { DomainEvent } from './domain-event';

export class IdentityFederated extends DomainEvent {
  constructor(
    public readonly providerId: string,
    public readonly userId: string,
    public readonly externalSubjectId: string
  ) {
    super(userId);
  }
}

export class SessionEstablished extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly ipAddress?: string
  ) {
    super(sessionId);
  }
}

export class SessionRevoked extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly reason: string
  ) {
    super(sessionId);
  }
}

export class RiskEvaluated extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly riskScore: number,
    public readonly riskLevel: string
  ) {
    super(userId);
  }
}

export class ConditionalAccessTriggered extends DomainEvent {
  constructor(
    public readonly policyId: string,
    public readonly userId: string,
    public readonly action: string
  ) {
    super(policyId);
  }
}

export class BreakGlassActivated extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly ownerEmail: string,
    public readonly emergencyReason: string
  ) {
    super(accountId);
  }
}

export class SecretRotated extends DomainEvent {
  constructor(
    public readonly vaultId: string,
    public readonly secretName: string
  ) {
    super(vaultId);
  }
}

export class CertificateIssued extends DomainEvent {
  constructor(
    public readonly certId: string,
    public readonly serialNumber: string,
    public readonly commonName: string
  ) {
    super(certId);
  }
}

export class CertificateRevoked extends DomainEvent {
  constructor(
    public readonly certId: string,
    public readonly serialNumber: string
  ) {
    super(certId);
  }
}

export class SecThreatDetected extends DomainEvent {
  constructor(
    public readonly indicatorId: string,
    public readonly matchedEventId: string,
    public readonly riskScore: number
  ) {
    super(indicatorId);
  }
}

export class ComplianceScanned extends DomainEvent {
  constructor(
    public readonly framework: string,
    public readonly compliantCount: number,
    public readonly nonCompliantCount: number
  ) {
    super(framework);
  }
}
