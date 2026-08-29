import { DomainEvent } from './domain-event';

export class LowCodeAppCreated extends DomainEvent {
  constructor(public readonly appId: string) {
    super(appId);
  }
}

export class LowCodeAppPublished extends DomainEvent {
  constructor(public readonly appId: string, public readonly environment: string) {
    super(appId);
  }
}

export class LowCodeAppRolledBack extends DomainEvent {
  constructor(public readonly appId: string, public readonly restorePointId: string) {
    super(appId);
  }
}

export class FormCreated extends DomainEvent {
  constructor(public readonly formId: string) {
    super(formId);
  }
}

export class FormSubmitted extends DomainEvent {
  constructor(public readonly submissionId: string, public readonly formId: string) {
    super(submissionId);
  }
}

export class DashboardCreated extends DomainEvent {
  constructor(public readonly dashboardId: string) {
    super(dashboardId);
  }
}

export class ReportGenerated extends DomainEvent {
  constructor(public readonly reportId: string) {
    super(reportId);
  }
}

export class WorkflowDesigned extends DomainEvent {
  constructor(public readonly workflowId: string) {
    super(workflowId);
  }
}

export class RuleCreated extends DomainEvent {
  constructor(public readonly ruleId: string) {
    super(ruleId);
  }
}

export class ThemePublished extends DomainEvent {
  constructor(public readonly themeId: string) {
    super(themeId);
  }
}

export class ComponentPublished extends DomainEvent {
  constructor(public readonly componentId: string) {
    super(componentId);
  }
}

export class RestorePointCreated extends DomainEvent {
  constructor(public readonly restorePointId: string, public readonly appId: string) {
    super(restorePointId);
  }
}
