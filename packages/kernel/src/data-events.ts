import { DomainEvent } from './domain-event';

export class DatasetCreated extends DomainEvent {
  constructor(public readonly datasetId: string) {
    super(datasetId);
  }
}

export class DatasetUpdated extends DomainEvent {
  constructor(public readonly datasetId: string) {
    super(datasetId);
  }
}

export class PipelineStarted extends DomainEvent {
  constructor(public readonly executionId: string, public readonly pipelineId: string) {
    super(executionId);
  }
}

export class PipelineCompleted extends DomainEvent {
  constructor(public readonly executionId: string, public readonly records: number) {
    super(executionId);
  }
}

export class PipelineFailed extends DomainEvent {
  constructor(public readonly executionId: string, public readonly reason: string) {
    super(executionId);
  }
}

export class WarehouseUpdated extends DomainEvent {
  constructor(public readonly warehouseId: string) {
    super(warehouseId);
  }
}

export class DataQualityPassed extends DomainEvent {
  constructor(public readonly ruleId: string) {
    super(ruleId);
  }
}

export class DataQualityFailed extends DomainEvent {
  constructor(public readonly ruleId: string, public readonly issueId: string) {
    super(ruleId);
  }
}

export class ModelTrained extends DomainEvent {
  constructor(public readonly modelId: string, public readonly accuracy: number) {
    super(modelId);
  }
}

export class ModelDeployed extends DomainEvent {
  constructor(public readonly modelId: string, public readonly endpointUrl: string) {
    super(modelId);
  }
}

export class PredictionGenerated extends DomainEvent {
  constructor(public readonly modelId: string, public readonly predictionResult: string) {
    super(modelId);
  }
}

export class DashboardPublished extends DomainEvent {
  constructor(public readonly dashboardId: string) {
    super(dashboardId);
  }
}
