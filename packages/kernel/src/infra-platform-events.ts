import { DomainEvent } from './domain-event';

export class FailoverTriggered extends DomainEvent {
  constructor(
    public readonly planId: string,
    public readonly targetRegion: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class BackupCreated extends DomainEvent {
  constructor(
    public readonly snapshotId: string,
    public readonly sizeGb: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ScalingTriggered extends DomainEvent {
  constructor(
    public readonly clusterId: string,
    public readonly targetNodesCount: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ClusterAlertGenerated extends DomainEvent {
  constructor(
    public readonly alertId: string,
    public readonly severity: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class CertificateRotated extends DomainEvent {
  constructor(
    public readonly certId: string,
    public readonly domainName: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}
