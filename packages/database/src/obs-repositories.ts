import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
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
  ObsNotificationTemplate
} from '@eduverse/kernel';

export class ObservabilityTraceSpanRepository extends BaseTenantRepository {
  async save(span: ObservabilityTraceSpan): Promise<void> {
    await prisma.observabilityTraceSpan.create({
      data: {
        id: span.id,
        tenantId: this.getTenantIdOrThrow(),
        traceId: span.traceId,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        serviceName: span.serviceName,
        operationName: span.operationName,
        durationMs: span.durationMs,
        statusCode: span.statusCode,
        metaJson: span.metaJson,
      },
    });
  }
}

export class SystemLogEntryRepository extends BaseTenantRepository {
  async save(log: SystemLogEntry): Promise<void> {
    await prisma.systemLogEntry.create({
      data: {
        id: log.id,
        tenantId: this.getTenantIdOrThrow(),
        externalLogId: log.externalLogId,
        provider: log.provider,
        traceId: log.traceId,
        spanId: log.spanId,
        correlationId: log.correlationId,
        serviceName: log.serviceName,
        level: log.level,
        category: log.category,
        message: log.message,
        metaJson: log.metaJson,
      },
    });
  }
}

export class ServiceHealthProbeRepository extends BaseTenantRepository {
  async save(probe: ServiceHealthProbe): Promise<void> {
    await prisma.serviceHealthProbe.create({
      data: {
        id: probe.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: probe.serviceName,
        probeType: probe.probeType,
        status: probe.status,
        latencyMs: probe.latencyMs,
        lastSuccessAt: probe.lastSuccessAt,
        lastFailureAt: probe.lastFailureAt,
        successRate: probe.successRate,
        failureCount: probe.failureCount,
        averageLatency: probe.averageLatency,
        nextScheduledExecution: probe.nextScheduledExecution,
        detailsJson: probe.detailsJson,
      },
    });
  }
}

export class PlatformMetricRepository extends BaseTenantRepository {
  async save(metric: PlatformMetric): Promise<void> {
    await prisma.platformMetric.create({
      data: {
        id: metric.id,
        tenantId: this.getTenantIdOrThrow(),
        metricName: metric.metricName,
        metricType: metric.metricType,
        value: metric.value,
        metricUnit: metric.metricUnit,
        metricSource: metric.metricSource,
        metricLabels: metric.metricLabels,
        aggregationWindow: metric.aggregationWindow,
        aggregationMethod: metric.aggregationMethod,
      },
    });
  }
}

export class SreServiceLevelRepository extends BaseTenantRepository {
  async save(sre: SreServiceLevel): Promise<void> {
    await prisma.sreServiceLevel.upsert({
      where: { id: sre.id },
      update: { errorBudgetRemaining: sre.errorBudgetRemaining, sliTarget: sre.sliTarget, sloThreshold: sre.sloThreshold },
      create: {
        id: sre.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: sre.serviceName,
        sliTarget: sre.sliTarget,
        sloThreshold: sre.sloThreshold,
        slaTarget: sre.slaTarget,
        errorBudgetRemaining: sre.errorBudgetRemaining,
        periodDays: sre.periodDays,
      },
    });
  }
}

export class IncidentRecordRepository extends BaseTenantRepository {
  async save(inc: IncidentRecord): Promise<void> {
    await prisma.incidentRecord.upsert({
      where: { id: inc.id },
      update: { status: inc.status, rcaSummary: inc.rcaSummary, resolvedAt: inc.resolvedAt, postMortemCompleted: inc.postMortemCompleted },
      create: {
        id: inc.id,
        tenantId: this.getTenantIdOrThrow(),
        title: inc.title,
        severity: inc.severity,
        status: inc.status,
        assigneeEmail: inc.assigneeEmail,
        impactLevel: inc.impactLevel,
        detectedBy: inc.detectedBy,
        affectedServices: inc.affectedServices,
        rootCauseStatus: inc.rootCauseStatus,
        mitigationStatus: inc.mitigationStatus,
        recoveryDuration: inc.recoveryDuration,
        postMortemCompleted: inc.postMortemCompleted,
        timelineJson: inc.timelineJson,
        rcaSummary: inc.rcaSummary,
        resolvedAt: inc.resolvedAt,
      },
    });
  }
}

export class DevOpsDeploymentRepository extends BaseTenantRepository {
  async save(dep: DevOpsDeployment): Promise<void> {
    await prisma.devOpsDeployment.upsert({
      where: { id: dep.id },
      update: { status: dep.status, rollbackReason: dep.rollbackReason },
      create: {
        id: dep.id,
        tenantId: this.getTenantIdOrThrow(),
        releaseVersion: dep.releaseVersion,
        strategy: dep.strategy,
        status: dep.status,
        approvalStatus: dep.approvalStatus,
        releaseNotes: dep.releaseNotes,
        environment: dep.environment,
        artifactVersion: dep.artifactVersion,
        commitHash: dep.commitHash,
        pipelineId: dep.pipelineId,
        deploymentDuration: dep.deploymentDuration,
        triggeredBy: dep.triggeredBy,
        rollbackReason: dep.rollbackReason,
      },
    });
  }
}

export class FeatureFlagSettingRepository extends BaseTenantRepository {
  async save(flag: FeatureFlagSetting): Promise<void> {
    await prisma.featureFlagSetting.upsert({
      where: { id: flag.id },
      update: { isEnabled: flag.isEnabled, rolloutPercentage: flag.rolloutPercentage, rulesJson: flag.rulesJson },
      create: {
        id: flag.id,
        tenantId: this.getTenantIdOrThrow(),
        flagKey: flag.flagKey,
        isEnabled: flag.isEnabled,
        description: flag.description,
        rolloutPercentage: flag.rolloutPercentage,
        targetAudience: flag.targetAudience,
        environment: flag.environment,
        expiresAt: flag.expiresAt,
        createdBy: flag.flagCreatedBy,
        approvedBy: flag.approvedBy,
        rulesJson: flag.rulesJson,
      },
    });
  }
}

export class PlatformMaintenanceRepository extends BaseTenantRepository {
  async save(maint: PlatformMaintenance): Promise<void> {
    await prisma.platformMaintenance.create({
      data: {
        id: maint.id,
        tenantId: this.getTenantIdOrThrow(),
        isMaintenanceActive: maint.isMaintenanceActive,
        reason: maint.reason,
        scheduledStart: maint.scheduledStart,
        scheduledEnd: maint.scheduledEnd,
      },
    });
  }
}

export class ClusterNodeStatusRepository extends BaseTenantRepository {
  async save(node: ClusterNodeStatus): Promise<void> {
    await prisma.clusterNodeStatus.upsert({
      where: { id: node.id },
      update: { cpuUsage: node.cpuUsage, memoryUsage: node.memoryUsage, diskUsage: node.diskUsage, podCount: node.podCount, lastHeartbeat: node.lastHeartbeat },
      create: {
        id: node.id,
        tenantId: this.getTenantIdOrThrow(),
        nodeId: node.nodeId,
        nodeRole: node.nodeRole,
        cpuUsage: node.cpuUsage,
        memoryUsage: node.memoryUsage,
        status: node.status,
        diskUsage: node.diskUsage,
        networkUsage: node.networkUsage,
        podCount: node.podCount,
        containerCount: node.containerCount,
        region: node.region,
        availabilityZone: node.availabilityZone,
        lastHeartbeat: node.lastHeartbeat,
      },
    });
  }
}

export class ServiceRegistryEntryRepository extends BaseTenantRepository {
  async save(reg: ServiceRegistryEntry): Promise<void> {
    await prisma.serviceRegistryEntry.upsert({
      where: { id: reg.id },
      update: { status: reg.status, version: reg.serviceVersion },
      create: {
        id: reg.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: reg.serviceName,
        endpointUrl: reg.endpointUrl,
        version: reg.serviceVersion,
        status: reg.status,
      },
    });
  }
}

export class SecurityEventLogRepository extends BaseTenantRepository {
  async save(sec: SecurityEventLog): Promise<void> {
    await prisma.securityEventLog.create({
      data: {
        id: sec.id,
        tenantId: this.getTenantIdOrThrow(),
        eventType: sec.eventType,
        severity: sec.severity,
        actorEmail: sec.actorEmail,
        ipAddress: sec.ipAddress,
        geoLocation: sec.geoLocation,
        userAgent: sec.userAgent,
        riskScore: sec.riskScore,
        mitreTechnique: sec.mitreTechnique,
        actionTaken: sec.actionTaken,
        detailsJson: sec.detailsJson,
      },
    });
  }
}

export class ObsAlertRuleRepository extends BaseTenantRepository {
  async save(rule: ObsAlertRule): Promise<void> {
    await prisma.obsAlertRule.upsert({
      where: { id: rule.id },
      update: { threshold: rule.threshold, isEnabled: rule.isEnabled },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleName: rule.ruleName,
        metricName: rule.metricName,
        condition: rule.condition,
        threshold: rule.threshold,
        severity: rule.severity,
        isEnabled: rule.isEnabled,
      },
    });
  }
}

export class AlertPolicyRepository extends BaseTenantRepository {
  async save(pol: AlertPolicy): Promise<void> {
    await prisma.alertPolicy.upsert({
      where: { id: pol.id },
      update: { repeatIntervalMinutes: pol.repeatIntervalMinutes },
      create: {
        id: pol.id,
        tenantId: this.getTenantIdOrThrow(),
        policyName: pol.policyName,
        escalationDelayMinutes: pol.escalationDelayMinutes,
        repeatIntervalMinutes: pol.repeatIntervalMinutes,
      },
    });
  }
}

export class AlertChannelRepository extends BaseTenantRepository {
  async save(chan: AlertChannel): Promise<void> {
    await prisma.alertChannel.upsert({
      where: { id: chan.id },
      update: { configJson: chan.configJson },
      create: {
        id: chan.id,
        tenantId: this.getTenantIdOrThrow(),
        channelName: chan.channelName,
        channelType: chan.channelType,
        configJson: chan.configJson,
      },
    });
  }
}

export class AlertSubscriptionRepository extends BaseTenantRepository {
  async save(sub: AlertSubscription): Promise<void> {
    await prisma.alertSubscription.create({
      data: {
        id: sub.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleId: sub.ruleId,
        channelId: sub.channelId,
        isEnabled: sub.isEnabled,
      },
    });
  }
}

export class AlertHistoryRepository extends BaseTenantRepository {
  async save(hist: AlertHistory): Promise<void> {
    await prisma.alertHistory.upsert({
      where: { id: hist.id },
      update: { status: hist.status, resolvedAt: hist.resolvedAt },
      create: {
        id: hist.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleId: hist.ruleId,
        metricValue: hist.metricValue,
        triggerReason: hist.triggerReason,
        status: hist.status,
        firedAt: hist.firedAt,
        resolvedAt: hist.resolvedAt,
      },
    });
  }
}

export class AlertEscalationRepository extends BaseTenantRepository {
  async save(esc: AlertEscalation): Promise<void> {
    await prisma.alertEscalation.create({
      data: {
        id: esc.id,
        tenantId: this.getTenantIdOrThrow(),
        historyId: esc.historyId,
        level: esc.level,
        assigneeEmail: esc.assigneeEmail,
        status: esc.status,
        escalatedAt: esc.escalatedAt,
      },
    });
  }
}

export class ObsNotificationTemplateRepository extends BaseTenantRepository {
  async save(tpl: ObsNotificationTemplate): Promise<void> {
    await prisma.obsNotificationTemplate.upsert({
      where: { id: tpl.id },
      update: { bodyTemplate: tpl.bodyTemplate },
      create: {
        id: tpl.id,
        tenantId: this.getTenantIdOrThrow(),
        name: tpl.name,
        channelType: tpl.channelType,
        subjectTemplate: tpl.subjectTemplate,
        bodyTemplate: tpl.bodyTemplate,
      },
    });
  }
}
