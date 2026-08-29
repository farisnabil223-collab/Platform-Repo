import { DomainEvent } from './domain-event';

export class AppProvisioned extends DomainEvent {
  constructor(
    public readonly appId: string,
    public readonly appName: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class GitOpsSynced extends DomainEvent {
  constructor(
    public readonly gitopsAppId: string,
    public readonly syncCommit: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ReleaseTrainApproved extends DomainEvent {
  constructor(
    public readonly trainId: string,
    public readonly status: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class PipelineStagePromoted extends DomainEvent {
  constructor(
    public readonly pipelineId: string,
    public readonly promotedStage: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class ScorecardGenerated extends DomainEvent {
  constructor(
    public readonly scorecardId: string,
    public readonly overallScore: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class CostLimitReached extends DomainEvent {
  constructor(
    public readonly costCenter: string,
    public readonly currentChargeback: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}
