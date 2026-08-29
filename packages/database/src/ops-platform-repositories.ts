import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  MeshService,
  MeshTrafficPolicy,
  GatewayRoute,
  DynamicConfig,
  DistributedLock,
  DistributedJob,
  CapacityForecast,
  PlatformAuditLog,
  Incident,
  Runbook,
  OpsCompliancePolicy
} from '@eduverse/kernel';

export class MeshServiceRepository extends BaseTenantRepository {
  async save(service: MeshService): Promise<void> {
    await prisma.meshService.upsert({
      where: { id: service.id },
      update: { status: service.status, mtlsEnabled: service.mtlsEnabled },
      create: {
        id: service.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: service.serviceName,
        mtlsEnabled: service.mtlsEnabled,
        status: service.status,
      },
    });
  }
}

export class MeshTrafficPolicyRepository extends BaseTenantRepository {
  async save(policy: MeshTrafficPolicy): Promise<void> {
    await prisma.meshTrafficPolicy.upsert({
      where: { id: policy.id },
      update: { circuitBreaker: policy.circuitBreaker, retryPolicy: policy.retryPolicy, timeoutMs: policy.timeoutMs, mirrorTarget: policy.mirrorTarget ?? null },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceId: policy.serviceId,
        circuitBreaker: policy.circuitBreaker,
        retryPolicy: policy.retryPolicy,
        timeoutMs: policy.timeoutMs,
        mirrorTarget: policy.mirrorTarget ?? null,
      },
    });
  }
}

export class GatewayRouteRepository extends BaseTenantRepository {
  async save(route: GatewayRoute): Promise<void> {
    await prisma.gatewayRoute.upsert({
      where: { id: route.id },
      update: { status: route.status, rateLimit: route.rateLimit, quotaLimit: route.quotaLimit },
      create: {
        id: route.id,
        tenantId: this.getTenantIdOrThrow(),
        routePath: route.routePath,
        apiVersion: route.apiVersion,
        rateLimit: route.rateLimit,
        quotaLimit: route.quotaLimit,
        status: route.status,
      },
    });
  }
}

export class DynamicConfigRepository extends BaseTenantRepository {
  async save(config: DynamicConfig): Promise<void> {
    await prisma.dynamicConfig.upsert({
      where: { id: config.id },
      update: { configValue: config.configValue, version: config.configVersion },
      create: {
        id: config.id,
        tenantId: this.getTenantIdOrThrow(),
        configKey: config.configKey,
        configValue: config.configValue,
        isFeatureFlag: config.isFeatureFlag,
        version: config.configVersion,
        environment: config.environment,
      },
    });
  }
}

export class DistributedLockRepository extends BaseTenantRepository {
  async save(lock: DistributedLock): Promise<void> {
    await prisma.distributedLock.upsert({
      where: { id: lock.id },
      update: { leaseMs: lock.leaseMs },
      create: {
        id: lock.id,
        tenantId: this.getTenantIdOrThrow(),
        lockName: lock.lockName,
        ownerId: lock.ownerId,
        leaseMs: lock.leaseMs,
        acquiredAt: lock.acquiredAt,
      },
    });
  }
}

export class DistributedJobRepository extends BaseTenantRepository {
  async save(job: DistributedJob): Promise<void> {
    await prisma.distributedJob.upsert({
      where: { id: job.id },
      update: { status: job.status, retryCount: job.retryCount },
      create: {
        id: job.id,
        tenantId: this.getTenantIdOrThrow(),
        jobName: job.jobName,
        schedule: job.schedule ?? null,
        priority: job.priority,
        status: job.status,
        workerPool: job.workerPool,
        retryCount: job.retryCount,
        runAt: job.runAt,
      },
    });
  }
}

export class CapacityForecastRepository extends BaseTenantRepository {
  async save(forecast: CapacityForecast): Promise<void> {
    await prisma.capacityForecast.create({
      data: {
        id: forecast.id,
        tenantId: this.getTenantIdOrThrow(),
        targetDate: forecast.targetDate,
        forecastCpu: forecast.forecastCpu,
        forecastRam: forecast.forecastRam,
        growthRate: forecast.growthRate,
        costEstimate: forecast.costEstimate,
      },
    });
  }
}

export class PlatformAuditLogRepository extends BaseTenantRepository {
  async save(log: PlatformAuditLog): Promise<void> {
    await prisma.platformAuditLog.create({
      data: {
        id: log.id,
        tenantId: this.getTenantIdOrThrow(),
        auditType: log.auditType,
        actionName: log.actionName,
        actor: log.actor,
        details: log.details,
      },
    });
  }
}

export class IncidentRepository extends BaseTenantRepository {
  async save(incident: Incident): Promise<void> {
    await prisma.incident.upsert({
      where: { id: incident.id },
      update: { status: incident.status, postmortem: incident.postmortem ?? null, resolvedAt: incident.resolvedAt ?? null },
      create: {
        id: incident.id,
        tenantId: this.getTenantIdOrThrow(),
        severity: incident.severity,
        title: incident.title,
        status: incident.status,
        timeline: incident.timeline,
        postmortem: incident.postmortem ?? null,
        createdAt: incident.incidentCreatedAt,
        resolvedAt: incident.resolvedAt ?? null,
      },
    });
  }
}

export class RunbookRepository extends BaseTenantRepository {
  async save(runbook: Runbook): Promise<void> {
    await prisma.runbook.upsert({
      where: { id: runbook.id },
      update: { procedures: runbook.procedures },
      create: {
        id: runbook.id,
        tenantId: this.getTenantIdOrThrow(),
        name: runbook.name,
        procedures: runbook.procedures,
        playbookText: runbook.playbookText,
        scriptPath: runbook.scriptPath,
      },
    });
  }
}

export class OpsCompliancePolicyRepository extends BaseTenantRepository {
  async save(policy: OpsCompliancePolicy): Promise<void> {
    await prisma.opsCompliancePolicy.upsert({
      where: { id: policy.id },
      update: { status: policy.status },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        policyName: policy.policyName,
        policyType: policy.policyType,
        validationRule: policy.validationRule,
        status: policy.status,
      },
    });
  }
}
