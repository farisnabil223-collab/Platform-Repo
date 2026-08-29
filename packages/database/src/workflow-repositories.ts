import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowCheckpoint,
  ApprovalFlow,
  ApprovalDecision,
  BusinessRule,
  AutomatedTask,
  AutomationRule,
  AutomationLog,
  SlaPolicy,
  SlaViolation
} from '@eduverse/kernel';

export class WorkflowDefinitionRepository extends BaseTenantRepository {
  async save(def: WorkflowDefinition): Promise<void> {
    await prisma.workflowDefinition.upsert({
      where: { id: def.id },
      update: { status: def.status, nodesJson: def.nodesJson, gatewaysJson: def.gatewaysJson },
      create: {
        id: def.id,
        tenantId: this.getTenantIdOrThrow(),
        title: def.title,
        version: def.definitionVersion,
        status: def.status,
        nodesJson: def.nodesJson,
        gatewaysJson: def.gatewaysJson,
      },
    });
  }

  async findById(id: string): Promise<WorkflowDefinition | null> {
    const row = await prisma.workflowDefinition.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new WorkflowDefinition(row.id, {
      tenantId: row.tenantId,
      title: row.title,
      version: row.version,
      status: row.status,
      nodesJson: row.nodesJson,
      gatewaysJson: row.gatewaysJson,
    });
  }
}

export class WorkflowInstanceRepository extends BaseTenantRepository {
  async save(inst: WorkflowInstance): Promise<void> {
    await prisma.workflowInstance.upsert({
      where: { id: inst.id },
      update: { currentState: inst.currentState, tokensJson: inst.tokensJson, variables: inst.variables },
      create: {
        id: inst.id,
        tenantId: this.getTenantIdOrThrow(),
        definitionId: inst.definitionId,
        currentState: inst.currentState,
        tokensJson: inst.tokensJson,
        variables: inst.variables,
      },
    });
  }

  async findById(id: string): Promise<WorkflowInstance | null> {
    const row = await prisma.workflowInstance.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new WorkflowInstance(row.id, {
      tenantId: row.tenantId,
      definitionId: row.definitionId,
      currentState: row.currentState,
      tokensJson: row.tokensJson,
      variables: row.variables,
    });
  }
}

export class WorkflowCheckpointRepository extends BaseTenantRepository {
  async save(cp: WorkflowCheckpoint): Promise<void> {
    await prisma.workflowCheckpoint.upsert({
      where: { id: cp.id },
      update: { snapshot: cp.snapshot },
      create: {
        id: cp.id,
        tenantId: this.getTenantIdOrThrow(),
        instanceId: cp.instanceId,
        stateName: cp.stateName,
        snapshot: cp.snapshot,
      },
    });
  }
}

export class ApprovalFlowRepository extends BaseTenantRepository {
  async save(flow: ApprovalFlow): Promise<void> {
    await prisma.approvalFlow.upsert({
      where: { id: flow.id },
      update: { stagesJson: flow.stagesJson, policyRules: flow.policyRules },
      create: {
        id: flow.id,
        tenantId: this.getTenantIdOrThrow(),
        title: flow.title,
        stagesJson: flow.stagesJson,
        policyRules: flow.policyRules,
      },
    });
  }

  async findById(id: string): Promise<ApprovalFlow | null> {
    const row = await prisma.approvalFlow.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new ApprovalFlow(row.id, {
      tenantId: row.tenantId,
      title: row.title,
      stagesJson: row.stagesJson,
      policyRules: row.policyRules,
    });
  }
}

export class ApprovalDecisionRepository extends BaseTenantRepository {
  async save(dec: ApprovalDecision): Promise<void> {
    await prisma.approvalDecision.upsert({
      where: { id: dec.id },
      update: { decision: dec.decision, comments: dec.comments },
      create: {
        id: dec.id,
        tenantId: this.getTenantIdOrThrow(),
        flowId: dec.flowId,
        approverId: dec.approverId,
        decision: dec.decision,
        comments: dec.comments,
      },
    });
  }

  async findManyByFlowId(flowId: string): Promise<ApprovalDecision[]> {
    const rows = await prisma.approvalDecision.findMany({
      where: { flowId, tenantId: this.getTenantIdOrThrow() },
    });
    return rows.map(r => new ApprovalDecision(r.id, {
      tenantId: r.tenantId,
      flowId: r.flowId,
      approverId: r.approverId,
      decision: r.decision,
      comments: r.comments ?? undefined,
    }));
  }
}

export class BusinessRuleRepository extends BaseTenantRepository {
  async save(rule: BusinessRule): Promise<void> {
    await prisma.businessRule.upsert({
      where: { id: rule.id },
      update: { expression: rule.expression, priority: rule.priority },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        name: rule.name,
        ruleSet: rule.ruleSet,
        expression: rule.expression,
        priority: rule.priority,
        actionJson: rule.actionJson,
      },
    });
  }
}

export class AutomatedTaskRepository extends BaseTenantRepository {
  async save(task: AutomatedTask): Promise<void> {
    await prisma.automatedTask.upsert({
      where: { id: task.id },
      update: { status: task.status, reminders: task.reminders },
      create: {
        id: task.id,
        tenantId: this.getTenantIdOrThrow(),
        title: task.title,
        assigneeId: task.assigneeId,
        priority: task.priority,
        deadline: task.deadline,
        status: task.status,
        reminders: task.reminders,
      },
    });
  }
}

export class AutomationRuleRepository extends BaseTenantRepository {
  async save(rule: AutomationRule): Promise<void> {
    await prisma.automationRule.upsert({
      where: { id: rule.id },
      update: { expression: rule.expression },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        triggerType: rule.triggerType,
        expression: rule.expression,
        actionJson: rule.actionJson,
      },
    });
  }
}

export class AutomationLogRepository extends BaseTenantRepository {
  async save(log: AutomationLog): Promise<void> {
    await prisma.automationLog.create({
      data: {
        id: log.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleId: log.ruleId,
        status: log.status,
        output: log.output,
      },
    });
  }
}

export class SlaPolicyRepository extends BaseTenantRepository {
  async save(policy: SlaPolicy): Promise<void> {
    await prisma.slaPolicy.upsert({
      where: { id: policy.id },
      update: { targetHours: policy.targetHours },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        policyName: policy.policyName,
        targetHours: policy.targetHours,
      },
    });
  }
}

export class SlaViolationRepository extends BaseTenantRepository {
  async save(violation: SlaViolation): Promise<void> {
    await prisma.slaViolation.create({
      data: {
        id: violation.id,
        tenantId: this.getTenantIdOrThrow(),
        policyId: violation.policyId,
        referenceId: violation.referenceId,
      },
    });
  }
}
