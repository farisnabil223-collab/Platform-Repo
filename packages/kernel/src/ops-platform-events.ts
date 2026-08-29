import { DomainEvent } from './domain-event';

export class MeshPolicyUpdated extends DomainEvent {
  constructor(
    public readonly serviceId: string,
    public readonly enabledMtls: boolean,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ConfigChanged extends DomainEvent {
  constructor(
    public readonly configKey: string,
    public readonly version: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class LockAcquired extends DomainEvent {
  constructor(
    public readonly lockName: string,
    public readonly ownerId: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class JobStatusUpdated extends DomainEvent {
  constructor(
    public readonly jobId: string,
    public readonly status: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class OpsIncidentTriggered extends DomainEvent {
  constructor(
    public readonly incidentId: string,
    public readonly severity: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class AuditLogged extends DomainEvent {
  constructor(
    public readonly auditId: string,
    public readonly auditType: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}
