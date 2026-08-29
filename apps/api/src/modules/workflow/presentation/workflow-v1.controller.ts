import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  WorkflowDefinitionRepository,
  WorkflowInstanceRepository,
  WorkflowCheckpointRepository,
  ApprovalFlowRepository,
  ApprovalDecisionRepository,
  BusinessRuleRepository,
  AutomatedTaskRepository,
  AutomationRuleRepository,
  AutomationLogRepository,
  SlaPolicyRepository,
  SlaViolationRepository
} from '@eduverse/database';
import {
  generateUuidV7,
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
  SlaViolation,
  WorkflowEngineEvaluator,
  ApprovalFlowEngine,
  BusinessRulesEngine,
  DomainEventBus,
  WorkflowCreated,
  WorkflowStarted,
  WorkflowCompleted,
  WorkflowFailed,
  WorkflowCancelled,
  ApprovalRequested,
  ApprovalGranted,
  ApprovalRejected,
  TaskAssigned,
  TaskCompleted,
  TaskEscalated,
  AutomationTriggered,
  AutomationCompleted,
  RuleExecuted,
  SlaViolated,
  NotificationSent
} from '@eduverse/kernel';

@ApiTags('Workflow & Business Process Automation')
@Controller('workflows')
export class WorkflowController {
  private readonly defRepo = new WorkflowDefinitionRepository();
  private readonly instRepo = new WorkflowInstanceRepository();
  private readonly cpRepo = new WorkflowCheckpointRepository();
  private readonly flowRepo = new ApprovalFlowRepository();
  private readonly decRepo = new ApprovalDecisionRepository();
  private readonly ruleRepo = new BusinessRuleRepository();
  private readonly taskRepo = new AutomatedTaskRepository();
  private readonly autoRepo = new AutomationRuleRepository();
  private readonly logRepo = new AutomationLogRepository();
  private readonly slaRepo = new SlaPolicyRepository();
  private readonly violationRepo = new SlaViolationRepository();

  private readonly engine = new WorkflowEngineEvaluator();
  private readonly approvals = new ApprovalFlowEngine();
  private readonly rules = new BusinessRulesEngine();

  // 1. Workflows Definitions & Instances
  @Post('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new workflow process definitions' })
  async createDefinition(@Request() req: any, @Body() body: {
    title: string;
    version?: number;
    status?: string;
    nodesJson: any;
    gatewaysJson?: any;
  }) {
    const def = new WorkflowDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      version: body.version ?? 1,
      status: body.status ?? 'DRAFT',
      nodesJson: body.nodesJson,
      gatewaysJson: body.gatewaysJson ?? {},
    });
    await this.defRepo.save(def);
    await DomainEventBus.getInstance().publish(new WorkflowCreated(def.id));
    return { success: true, definitionId: def.id };
  }

  @Post('instances')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Launch workflow execution process instances' })
  async startInstance(@Request() req: any, @Body() body: {
    definitionId: string;
    variables: any;
  }) {
    const inst = new WorkflowInstance(generateUuidV7(), {
      tenantId: req.user.tenantId,
      definitionId: body.definitionId,
      currentState: 'START',
      tokensJson: [{ nodeId: 'START', status: 'ACTIVE' }],
      variables: body.variables,
    });
    await this.instRepo.save(inst);
    await DomainEventBus.getInstance().publish(new WorkflowStarted(inst.id));
    return { success: true, instanceId: inst.id, currentState: inst.currentState };
  }

  @Post('checkpoints')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Store execution checkpoints snapshot states' })
  async saveCheckpoint(@Request() req: any, @Body() body: {
    instanceId: string;
    stateName: string;
    snapshot: any;
  }) {
    const cp = new WorkflowCheckpoint(generateUuidV7(), {
      tenantId: req.user.tenantId,
      instanceId: body.instanceId,
      stateName: body.stateName,
      snapshot: body.snapshot,
    });
    await this.cpRepo.save(cp);
    return { success: true, checkpointId: cp.id };
  }

  // 2. Multi-Stage Approvals
  @Post('approvals')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure multi-stage approval flow policies' })
  async createApprovalFlow(@Request() req: any, @Body() body: {
    title: string;
    stagesJson: any;
    policyRules: any;
  }) {
    const flow = new ApprovalFlow(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      stagesJson: body.stagesJson,
      policyRules: body.policyRules,
    });
    await this.flowRepo.save(flow);
    await DomainEventBus.getInstance().publish(new ApprovalRequested(flow.id));
    return { success: true, flowId: flow.id };
  }

  @Post('approvals/decisions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit approval stages decisions' })
  async submitDecision(@Request() req: any, @Body() body: {
    flowId: string;
    decision: string;
    comments?: string;
    requiredApprovals: number;
  }) {
    const dec = new ApprovalDecision(generateUuidV7(), {
      tenantId: req.user.tenantId,
      flowId: body.flowId,
      approverId: req.user.id,
      decision: body.decision,
      comments: body.comments,
    });
    await this.decRepo.save(dec);

    const all = await this.decRepo.findManyByFlowId(body.flowId);
    const approved = this.approvals.isStageApproved(
      all.map(d => ({ stageId: d.flowId, approverId: d.approverId, decision: d.decision })),
      body.requiredApprovals
    );

    if (approved) {
      await DomainEventBus.getInstance().publish(new ApprovalGranted(body.flowId));
    }

    return { success: true, decisionId: dec.id, isApproved: approved };
  }

  // 3. Business Rules Engine evaluations
  @Post('rules')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register business engine validation rules' })
  async createRule(@Request() req: any, @Body() body: {
    name: string;
    ruleSet: string;
    expression: string;
    priority?: number;
    actionJson: any;
  }) {
    const rule = new BusinessRule(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      ruleSet: body.ruleSet,
      expression: body.expression,
      priority: body.priority ?? 0,
      actionJson: body.actionJson,
    });
    await this.ruleRepo.save(rule);
    return { success: true, ruleId: rule.id };
  }

  @Post('rules/evaluate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Evaluate condition variables context against rules engine' })
  async evaluateRule(@Request() req: any, @Body() body: { expression: string; context: any }) {
    const result = this.rules.evaluate(body.expression, body.context);
    return { success: true, result };
  }

  // 4. Automated Task Queue deadlines
  @Post('tasks')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register task assignment deadlines' })
  async createTask(@Request() req: any, @Body() body: {
    title: string;
    assigneeId: string;
    priority?: string;
    deadline: string;
  }) {
    const task = new AutomatedTask(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      assigneeId: body.assigneeId,
      priority: body.priority ?? 'MEDIUM',
      deadline: new Date(body.deadline),
      status: 'PENDING',
      reminders: 0,
    });
    await this.taskRepo.save(task);
    await DomainEventBus.getInstance().publish(new TaskAssigned(task.id));
    return { success: true, taskId: task.id };
  }

  // 5. Automation triggers
  @Post('automation')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create automated action rules' })
  async createAutomation(@Request() req: any, @Body() body: {
    triggerType: string;
    expression: string;
    actionJson: any;
  }) {
    const rule = new AutomationRule(generateUuidV7(), {
      tenantId: req.user.tenantId,
      triggerType: body.triggerType,
      expression: body.expression,
      actionJson: body.actionJson,
    });
    await this.autoRepo.save(rule);

    const log = new AutomationLog(generateUuidV7(), {
      tenantId: req.user.tenantId,
      ruleId: rule.id,
      status: 'SUCCESS',
    });
    await this.logRepo.save(log);

    await DomainEventBus.getInstance().publish(new AutomationTriggered(rule.id));
    return { success: true, ruleId: rule.id };
  }

  // 6. SLA Policies target configurations
  @Post('sla')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure SLA performance metrics bounds' })
  async createSla(@Request() req: any, @Body() body: { policyName: string; targetHours: number }) {
    const policy = new SlaPolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      policyName: body.policyName,
      targetHours: body.targetHours,
    });
    await this.slaRepo.save(policy);
    return { success: true, policyId: policy.id };
  }
}
