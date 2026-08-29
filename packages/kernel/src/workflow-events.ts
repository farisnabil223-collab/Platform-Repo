import { DomainEvent } from './domain-event';

export class WorkflowCreated extends DomainEvent {
  constructor(public readonly definitionId: string) {
    super(definitionId);
  }
}

export class WorkflowStarted extends DomainEvent {
  constructor(public readonly instanceId: string) {
    super(instanceId);
  }
}

export class WorkflowCompleted extends DomainEvent {
  constructor(public readonly instanceId: string) {
    super(instanceId);
  }
}

export class WorkflowFailed extends DomainEvent {
  constructor(public readonly instanceId: string, public readonly reason: string) {
    super(instanceId);
  }
}

export class WorkflowCancelled extends DomainEvent {
  constructor(public readonly instanceId: string) {
    super(instanceId);
  }
}

export class ApprovalRequested extends DomainEvent {
  constructor(public readonly flowId: string) {
    super(flowId);
  }
}

export class ApprovalGranted extends DomainEvent {
  constructor(public readonly flowId: string) {
    super(flowId);
  }
}

export class ApprovalRejected extends DomainEvent {
  constructor(public readonly flowId: string) {
    super(flowId);
  }
}

export class TaskAssigned extends DomainEvent {
  constructor(public readonly taskId: string) {
    super(taskId);
  }
}

export class TaskCompleted extends DomainEvent {
  constructor(public readonly taskId: string) {
    super(taskId);
  }
}

export class TaskEscalated extends DomainEvent {
  constructor(public readonly taskId: string) {
    super(taskId);
  }
}

export class AutomationTriggered extends DomainEvent {
  constructor(public readonly ruleId: string) {
    super(ruleId);
  }
}

export class AutomationCompleted extends DomainEvent {
  constructor(public readonly ruleId: string) {
    super(ruleId);
  }
}

export class RuleExecuted extends DomainEvent {
  constructor(public readonly ruleId: string) {
    super(ruleId);
  }
}

export class SlaViolated extends DomainEvent {
  constructor(public readonly violationId: string) {
    super(violationId);
  }
}

export class NotificationSent extends DomainEvent {
  constructor(public readonly flowId: string, public readonly channel: string) {
    super(flowId);
  }
}
