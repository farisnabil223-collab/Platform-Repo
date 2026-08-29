import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  ObservabilityTraceSpanRepository,
  SystemLogEntryRepository,
  ServiceHealthProbeRepository,
  PlatformMetricRepository,
  SreServiceLevelRepository,
  IncidentRecordRepository,
  DevOpsDeploymentRepository,
  FeatureFlagSettingRepository,
  PlatformMaintenanceRepository,
  ClusterNodeStatusRepository,
  ServiceRegistryEntryRepository,
  SecurityEventLogRepository,
  ObsAlertRuleRepository,
  AlertPolicyRepository,
  AlertChannelRepository,
  AlertSubscriptionRepository,
  AlertHistoryRepository,
  AlertEscalationRepository,
  ObsNotificationTemplateRepository
} from '@eduverse/database';
import {
  generateUuidV7,
  ObservabilityTraceSpan,
  SystemLogEntry,
  ServiceHealthProbe,
  PlatformMetric,
  SreServiceLevel,
  IncidentRecord,
  DevOpsDeployment,
  FeatureFlagSetting,
  PlatformMaintenance,
  ClusterNodeStatus,
  ServiceRegistryEntry,
  SecurityEventLog,
  ObsAlertRule,
  AlertPolicy,
  AlertChannel,
  AlertSubscription,
  AlertHistory,
  AlertEscalation,
  ObsNotificationTemplate,
  OpenSearchLogProvider,
  SreErrorBudgetCalculator,
  CanaryDeploymentOrchestrator,
  AlertingEngineService,
  AIObservabilityEngine,
  DomainEventBus,
  TraceRecorded,
  LogEntryCreated,
  HealthProbeExecuted,
  MetricRecorded,
  IncidentTriggered,
  IncidentResolved,
  SloBreached,
  DeploymentStarted,
  DeploymentCompleted,
  DeploymentRolledBack,
  FeatureFlagUpdated,
  ThreatDetected,
  AlertTriggered,
  AlertResolved,
  AlertEscalated
} from '@eduverse/kernel';

// 1. MONITORING CONTROLLER
@ApiTags('Observability & SRE - Monitoring')
@Controller('monitoring')
export class MonitoringController {
  private readonly probeRepo = new ServiceHealthProbeRepository();

  @Post('health')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Execute & record service health probes' })
  async recordHealthProbe(@Request() req: any, @Body() body: {
    serviceName: string;
    probeType: string;
    status?: string;
    latencyMs: number;
    detailsJson: any;
  }) {
    const probe = new ServiceHealthProbe(generateUuidV7(), {
      tenantId: req.user.tenantId,
      serviceName: body.serviceName,
      probeType: body.probeType,
      status: body.status ?? 'HEALTHY',
      latencyMs: body.latencyMs,
      detailsJson: body.detailsJson,
    });
    await this.probeRepo.save(probe);
    await DomainEventBus.getInstance().publish(new HealthProbeExecuted(probe.id, probe.status));
    return { success: true, probeId: probe.id };
  }
}

// 2. METRICS CONTROLLER
@ApiTags('Observability & SRE - Metrics')
@Controller('metrics')
export class MetricsController {
  private readonly metricRepo = new PlatformMetricRepository();

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit Prometheus & Application Metrics' })
  async recordMetric(@Request() req: any, @Body() body: {
    metricName: string;
    metricType: string;
    value: number;
    metricUnit?: string;
    metricSource?: string;
    metricLabels: any;
  }) {
    const metric = new PlatformMetric(generateUuidV7(), {
      tenantId: req.user.tenantId,
      metricName: body.metricName,
      metricType: body.metricType,
      value: body.value,
      metricUnit: body.metricUnit ?? 'count',
      metricSource: body.metricSource ?? 'SYSTEM',
      metricLabels: body.metricLabels,
    });
    await this.metricRepo.save(metric);
    await DomainEventBus.getInstance().publish(new MetricRecorded(metric.id, body.metricName));
    return { success: true, metricId: metric.id };
  }
}

// 3. TRACING CONTROLLER
@ApiTags('Observability & SRE - Tracing')
@Controller('tracing')
export class TracingController {
  private readonly spanRepo = new ObservabilityTraceSpanRepository();

  @Post('spans')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record OpenTelemetry distributed trace span' })
  async recordSpan(@Request() req: any, @Body() body: {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
    durationMs: number;
    statusCode: number;
    metaJson: any;
  }) {
    const span = new ObservabilityTraceSpan(generateUuidV7(), {
      tenantId: req.user.tenantId,
      traceId: body.traceId,
      spanId: body.spanId,
      parentSpanId: body.parentSpanId,
      serviceName: body.serviceName,
      operationName: body.operationName,
      durationMs: body.durationMs,
      statusCode: body.statusCode,
      metaJson: body.metaJson,
    });
    await this.spanRepo.save(span);
    await DomainEventBus.getInstance().publish(new TraceRecorded(body.traceId, body.spanId));
    return { success: true, spanId: span.id };
  }
}

// 4. LOGGING CONTROLLER
@ApiTags('Observability & SRE - Centralized Logging')
@Controller('logs')
export class LoggingController {
  private readonly logRepo = new SystemLogEntryRepository();
  private readonly externalLogProvider = new OpenSearchLogProvider();

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit centralized log entry with external provider abstraction' })
  async recordLog(@Request() req: any, @Body() body: {
    serviceName: string;
    level: string;
    category: string;
    message: string;
    traceId?: string;
    spanId?: string;
    correlationId?: string;
    metaJson: any;
  }) {
    const logId = generateUuidV7();
    const externalId = await this.externalLogProvider.storeLogPayload(logId, body.metaJson);

    const entry = new SystemLogEntry(logId, {
      tenantId: req.user.tenantId,
      externalLogId: externalId,
      provider: 'OPENSEARCH',
      traceId: body.traceId,
      spanId: body.spanId,
      correlationId: body.correlationId,
      serviceName: body.serviceName,
      level: body.level,
      category: body.category,
      message: body.message,
      metaJson: body.metaJson,
    });
    await this.logRepo.save(entry);
    await DomainEventBus.getInstance().publish(new LogEntryCreated(logId, body.level));
    return { success: true, logId: entry.id, externalLogId: externalId };
  }
}

// 5. INCIDENT CONTROLLER
@ApiTags('Observability & SRE - Incident Management')
@Controller('incidents')
export class IncidentController {
  private readonly incRepo = new IncidentRecordRepository();
  private readonly aiObsEngine = new AIObservabilityEngine();

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create & manage incident records' })
  async createIncident(@Request() req: any, @Body() body: {
    title: string;
    severity: string;
    assigneeEmail?: string;
    impactLevel?: string;
    affectedServices: string[];
    timelineJson: any;
  }) {
    const inc = new IncidentRecord(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      severity: body.severity,
      status: 'OPEN',
      assigneeEmail: body.assigneeEmail,
      impactLevel: body.impactLevel,
      affectedServices: body.affectedServices,
      timelineJson: body.timelineJson,
    });
    await this.incRepo.save(inc);
    await DomainEventBus.getInstance().publish(new IncidentTriggered(inc.id, body.severity));
    return { success: true, incidentId: inc.id };
  }

  @Post('ai-rca')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Execute Modular AI Root Cause & Failure Analysis' })
  async executeAiRca(@Body() body: { traceSpans: any[] }) {
    const rcaResult = this.aiObsEngine.rcaEngine.identifyRootCause(body.traceSpans);
    return { success: true, rootCauseAnalysis: rcaResult };
  }
}

// 6. DEPLOYMENT CONTROLLER
@ApiTags('Observability & SRE - DevOps Deployments')
@Controller('deployments')
export class DeploymentController {
  private readonly depRepo = new DevOpsDeploymentRepository();
  private readonly canaryOrchestrator = new CanaryDeploymentOrchestrator();

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger DevOps Deployment Strategy (Direct, Blue-Green, Canary)' })
  async createDeployment(@Request() req: any, @Body() body: {
    releaseVersion: string;
    strategy?: string;
    environment?: string;
    commitHash?: string;
    pipelineId?: string;
    releaseNotes?: string;
  }) {
    const dep = new DevOpsDeployment(generateUuidV7(), {
      tenantId: req.user.tenantId,
      releaseVersion: body.releaseVersion,
      strategy: body.strategy ?? 'DIRECT',
      status: 'IN_PROGRESS',
      environment: body.environment ?? 'PRODUCTION',
      commitHash: body.commitHash,
      pipelineId: body.pipelineId,
      releaseNotes: body.releaseNotes,
    });
    await this.depRepo.save(dep);
    await DomainEventBus.getInstance().publish(new DeploymentStarted(dep.id, body.releaseVersion));
    return { success: true, deploymentId: dep.id };
  }

  @Post('canary/evaluate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Evaluate Canary Deployment signals for automatic promotion' })
  async evaluateCanary(@Body() body: { successRate: number; latencyP95: number }) {
    const result = this.canaryOrchestrator.evaluateCanaryHealth(body.successRate, body.latencyP95);
    return { success: true, evaluation: result };
  }
}

// 7. FEATURE FLAG CONTROLLER
@ApiTags('Observability & SRE - Feature Flags')
@Controller('platform/flags')
export class FeatureFlagController {
  private readonly flagRepo = new FeatureFlagSettingRepository();

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure feature flag settings and canary rollout percentages' })
  async setFeatureFlag(@Request() req: any, @Body() body: {
    flagKey: string;
    isEnabled: boolean;
    description?: string;
    rolloutPercentage?: number;
    targetAudience: any;
    environment?: string;
    rulesJson: any;
  }) {
    const flag = new FeatureFlagSetting(generateUuidV7(), {
      tenantId: req.user.tenantId,
      flagKey: body.flagKey,
      isEnabled: body.isEnabled,
      description: body.description,
      rolloutPercentage: body.rolloutPercentage ?? 100.0,
      targetAudience: body.targetAudience,
      environment: body.environment ?? 'GLOBAL',
      rulesJson: body.rulesJson,
    });
    await this.flagRepo.save(flag);
    await DomainEventBus.getInstance().publish(new FeatureFlagUpdated(flag.id, body.isEnabled));
    return { success: true, flagId: flag.id };
  }
}

// 8. SECURITY CONTROLLER
@ApiTags('Observability & SRE - Security Operations')
@Controller('security')
export class SecurityController {
  private readonly secRepo = new SecurityEventLogRepository();

  @Post('events')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log SIEM security events & threat detections' })
  async logSecurityEvent(@Request() req: any, @Body() body: {
    eventType: string;
    severity?: string;
    actorEmail?: string;
    ipAddress?: string;
    geoLocation?: string;
    riskScore?: number;
    mitreTechnique?: string;
    detailsJson: any;
  }) {
    const sec = new SecurityEventLog(generateUuidV7(), {
      tenantId: req.user.tenantId,
      eventType: body.eventType,
      severity: body.severity ?? 'LOW',
      actorEmail: body.actorEmail,
      ipAddress: body.ipAddress,
      geoLocation: body.geoLocation,
      riskScore: body.riskScore ?? 0.0,
      mitreTechnique: body.mitreTechnique,
      detailsJson: body.detailsJson,
    });
    await this.secRepo.save(sec);
    if ((body.riskScore ?? 0) > 70) {
      await DomainEventBus.getInstance().publish(new ThreatDetected(sec.id, body.riskScore ?? 0));
    }
    return { success: true, eventId: sec.id };
  }
}

// 9. ALERTING CONTROLLER
@ApiTags('Observability & SRE - Alerting Engine')
@Controller('alerting')
export class AlertingController {
  private readonly ruleRepo = new ObsAlertRuleRepository();
  private readonly chanRepo = new AlertChannelRepository();
  private readonly alertEngine = new AlertingEngineService();

  @Post('rules')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Define alert rules and threshold conditions' })
  async createAlertRule(@Request() req: any, @Body() body: {
    ruleName: string;
    metricName: string;
    condition?: string;
    threshold: number;
    severity?: string;
  }) {
    const rule = new ObsAlertRule(generateUuidV7(), {
      tenantId: req.user.tenantId,
      ruleName: body.ruleName,
      metricName: body.metricName,
      condition: body.condition ?? 'GREATER_THAN',
      threshold: body.threshold,
      severity: body.severity ?? 'WARNING',
    });
    await this.ruleRepo.save(rule);
    return { success: true, ruleId: rule.id };
  }

  @Post('channels')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register notification channels (Email, Slack, Teams, Webhook)' })
  async createAlertChannel(@Request() req: any, @Body() body: {
    channelName: string;
    channelType: string;
    configJson: any;
  }) {
    const chan = new AlertChannel(generateUuidV7(), {
      tenantId: req.user.tenantId,
      channelName: body.channelName,
      channelType: body.channelType,
      configJson: body.configJson,
    });
    await this.chanRepo.save(chan);
    return { success: true, channelId: chan.id };
  }
}

// 10. PLATFORM CONTROLLER
@ApiTags('Observability & SRE - Platform Operations')
@Controller('monitoring/telemetry-platform')
export class PlatformController {
  private readonly nodeRepo = new ClusterNodeStatusRepository();
  private readonly maintRepo = new PlatformMaintenanceRepository();

  @Post('nodes/heartbeat')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report Cluster Node health and resource usages' })
  async nodeHeartbeat(@Request() req: any, @Body() body: {
    nodeId: string;
    nodeRole: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage?: number;
    podCount?: number;
    region?: string;
  }) {
    const node = new ClusterNodeStatus(generateUuidV7(), {
      tenantId: req.user.tenantId,
      nodeId: body.nodeId,
      nodeRole: body.nodeRole,
      cpuUsage: body.cpuUsage,
      memoryUsage: body.memoryUsage,
      status: 'READY',
      diskUsage: body.diskUsage,
      podCount: body.podCount,
      region: body.region,
    });
    await this.nodeRepo.save(node);
    return { success: true, nodeId: node.id };
  }
}
