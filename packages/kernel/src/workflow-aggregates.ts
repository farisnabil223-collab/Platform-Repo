import { AggregateRoot } from './aggregate-root';

export interface WorkflowDefinitionProps {
  tenantId: string;
  title: string;
  version: number;
  status: string;
  nodesJson: any;
  gatewaysJson: any;
}

export class WorkflowDefinition extends AggregateRoot<WorkflowDefinitionProps> {
  constructor(id: string, props: WorkflowDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get definitionVersion(): number { return this.props.version; }
  get status(): string { return this.props.status; }
  get nodesJson(): any { return this.props.nodesJson; }
  get gatewaysJson(): any { return this.props.gatewaysJson; }
}

export interface WorkflowInstanceProps {
  tenantId: string;
  definitionId: string;
  currentState: string;
  tokensJson: any;
  variables: any;
}

export class WorkflowInstance extends AggregateRoot<WorkflowInstanceProps> {
  constructor(id: string, props: WorkflowInstanceProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get definitionId(): string { return this.props.definitionId; }
  get currentState(): string { return this.props.currentState; }
  get tokensJson(): any { return this.props.tokensJson; }
  get variables(): any { return this.props.variables; }
}

export interface WorkflowCheckpointProps {
  tenantId: string;
  instanceId: string;
  stateName: string;
  snapshot: any;
}

export class WorkflowCheckpoint extends AggregateRoot<WorkflowCheckpointProps> {
  constructor(id: string, props: WorkflowCheckpointProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get instanceId(): string { return this.props.instanceId; }
  get stateName(): string { return this.props.stateName; }
  get snapshot(): any { return this.props.snapshot; }
}

export interface ApprovalFlowProps {
  tenantId: string;
  title: string;
  stagesJson: any;
  policyRules: any;
}

export class ApprovalFlow extends AggregateRoot<ApprovalFlowProps> {
  constructor(id: string, props: ApprovalFlowProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get stagesJson(): any { return this.props.stagesJson; }
  get policyRules(): any { return this.props.policyRules; }
}

export interface ApprovalDecisionProps {
  tenantId: string;
  flowId: string;
  approverId: string;
  decision: string;
  comments?: string;
}

export class ApprovalDecision extends AggregateRoot<ApprovalDecisionProps> {
  constructor(id: string, props: ApprovalDecisionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get flowId(): string { return this.props.flowId; }
  get approverId(): string { return this.props.approverId; }
  get decision(): string { return this.props.decision; }
  get comments(): string | undefined { return this.props.comments; }
}

export interface BusinessRuleProps {
  tenantId: string;
  name: string;
  ruleSet: string;
  expression: string;
  priority: number;
  actionJson: any;
}

export class BusinessRule extends AggregateRoot<BusinessRuleProps> {
  constructor(id: string, props: BusinessRuleProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get ruleSet(): string { return this.props.ruleSet; }
  get expression(): string { return this.props.expression; }
  get priority(): number { return this.props.priority; }
  get actionJson(): any { return this.props.actionJson; }
}

export interface AutomatedTaskProps {
  tenantId: string;
  title: string;
  assigneeId: string;
  priority: string;
  deadline: Date;
  status: string;
  reminders: number;
}

export class AutomatedTask extends AggregateRoot<AutomatedTaskProps> {
  constructor(id: string, props: AutomatedTaskProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get assigneeId(): string { return this.props.assigneeId; }
  get priority(): string { return this.props.priority; }
  get deadline(): Date { return this.props.deadline; }
  get status(): string { return this.props.status; }
  get reminders(): number { return this.props.reminders; }
}

export interface AutomationRuleProps {
  tenantId: string;
  triggerType: string;
  expression: string;
  actionJson: any;
}

export class AutomationRule extends AggregateRoot<AutomationRuleProps> {
  constructor(id: string, props: AutomationRuleProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get triggerType(): string { return this.props.triggerType; }
  get expression(): string { return this.props.expression; }
  get actionJson(): any { return this.props.actionJson; }
}

export interface AutomationLogProps {
  tenantId: string;
  ruleId: string;
  status: string;
  output?: string;
}

export class AutomationLog extends AggregateRoot<AutomationLogProps> {
  constructor(id: string, props: AutomationLogProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get ruleId(): string { return this.props.ruleId; }
  get status(): string { return this.props.status; }
  get output(): string | undefined { return this.props.output; }
}

export interface SlaPolicyProps {
  tenantId: string;
  policyName: string;
  targetHours: number;
}

export class SlaPolicy extends AggregateRoot<SlaPolicyProps> {
  constructor(id: string, props: SlaPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get policyName(): string { return this.props.policyName; }
  get targetHours(): number { return this.props.targetHours; }
}

export interface SlaViolationProps {
  tenantId: string;
  policyId: string;
  referenceId: string;
}

export class SlaViolation extends AggregateRoot<SlaViolationProps> {
  constructor(id: string, props: SlaViolationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get policyId(): string { return this.props.policyId; }
  get referenceId(): string { return this.props.referenceId; }
}
