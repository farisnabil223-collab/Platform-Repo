import { DomainEvent } from './domain-event';

export class TraceRecorded extends DomainEvent {
  constructor(public readonly traceId: string, public readonly spanId: string) {
    super(traceId);
  }
}

export class LogEntryCreated extends DomainEvent {
  constructor(public readonly logId: string, public readonly level: string) {
    super(logId);
  }
}

export class HealthProbeExecuted extends DomainEvent {
  constructor(public readonly probeId: string, public readonly status: string) {
    super(probeId);
  }
}

export class MetricRecorded extends DomainEvent {
  constructor(public readonly metricId: string, public readonly metricName: string) {
    super(metricId);
  }
}

export class IncidentTriggered extends DomainEvent {
  constructor(public readonly incidentId: string, public readonly severity: string) {
    super(incidentId);
  }
}

export class IncidentResolved extends DomainEvent {
  constructor(public readonly incidentId: string) {
    super(incidentId);
  }
}

export class SloBreached extends DomainEvent {
  constructor(public readonly serviceLevelId: string, public readonly errorBudget: number) {
    super(serviceLevelId);
  }
}

export class DeploymentStarted extends DomainEvent {
  constructor(public readonly deploymentId: string, public readonly releaseVersion: string) {
    super(deploymentId);
  }
}

export class DeploymentCompleted extends DomainEvent {
  constructor(public readonly deploymentId: string) {
    super(deploymentId);
  }
}

export class DeploymentRolledBack extends DomainEvent {
  constructor(public readonly deploymentId: string, public readonly reason: string) {
    super(deploymentId);
  }
}

export class FeatureFlagUpdated extends DomainEvent {
  constructor(public readonly flagId: string, public readonly isEnabled: boolean) {
    super(flagId);
  }
}

export class ThreatDetected extends DomainEvent {
  constructor(public readonly eventId: string, public readonly riskScore: number) {
    super(eventId);
  }
}

export class AlertTriggered extends DomainEvent {
  constructor(public readonly alertId: string, public readonly ruleId: string) {
    super(alertId);
  }
}

export class AlertResolved extends DomainEvent {
  constructor(public readonly alertId: string) {
    super(alertId);
  }
}

export class AlertEscalated extends DomainEvent {
  constructor(public readonly escalationId: string, public readonly level: number) {
    super(escalationId);
  }
}
