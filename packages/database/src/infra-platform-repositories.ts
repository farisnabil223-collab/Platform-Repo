import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  CloudRegion,
  Cluster,
  ClusterNode,
  AvailabilityZone,
  DeploymentEnvironment,
  InfrastructureProvider,
  GlobalLoadBalancer,
  TrafficPolicy,
  GeoRoutingRule,
  DisasterRecoveryPlan,
  RecoveryExecution,
  BackupPolicy,
  RestoreOperation,
  InfrastructureHealth,
  InfrastructureAlert,
  InfrastructureMetric,
  ServiceEndpoint,
  ServiceDiscoveryRecord,
  InfrastructureCertificate
} from '@eduverse/kernel';

export class CloudRegionRepository extends BaseTenantRepository {
  async save(region: CloudRegion): Promise<void> {
    await prisma.cloudRegion.upsert({
      where: { id: region.id },
      update: { status: region.status },
      create: {
        id: region.id,
        tenantId: this.getTenantIdOrThrow(),
        name: region.name,
        provider: region.provider,
        status: region.status,
      },
    });
  }
}

export class ClusterRepository extends BaseTenantRepository {
  async save(cluster: Cluster): Promise<void> {
    await prisma.cluster.upsert({
      where: { id: cluster.id },
      update: { status: cluster.status, nodeCount: cluster.nodeCount },
      create: {
        id: cluster.id,
        tenantId: this.getTenantIdOrThrow(),
        name: cluster.name,
        region: cluster.region,
        status: cluster.status,
        nodeCount: cluster.nodeCount,
      },
    });
  }
}

export class ClusterNodeRepository extends BaseTenantRepository {
  async save(node: ClusterNode): Promise<void> {
    await prisma.clusterNode.upsert({
      where: { id: node.id },
      update: { status: node.status },
      create: {
        id: node.id,
        tenantId: this.getTenantIdOrThrow(),
        clusterId: node.clusterId,
        name: node.name,
        role: node.role,
        status: node.status,
      },
    });
  }
}

export class AvailabilityZoneRepository extends BaseTenantRepository {
  async save(az: AvailabilityZone): Promise<void> {
    await prisma.availabilityZone.upsert({
      where: { id: az.id },
      update: { status: az.status },
      create: {
        id: az.id,
        tenantId: this.getTenantIdOrThrow(),
        name: az.name,
        region: az.region,
        status: az.status,
      },
    });
  }
}

export class DeploymentEnvironmentRepository extends BaseTenantRepository {
  async save(env: DeploymentEnvironment): Promise<void> {
    await prisma.deploymentEnvironment.upsert({
      where: { id: env.id },
      update: { status: env.status },
      create: {
        id: env.id,
        tenantId: this.getTenantIdOrThrow(),
        name: env.name,
        status: env.status,
      },
    });
  }
}

export class InfrastructureProviderRepository extends BaseTenantRepository {
  async save(prov: InfrastructureProvider): Promise<void> {
    await prisma.infrastructureProvider.upsert({
      where: { id: prov.id },
      update: { status: prov.status, credentials: prov.credentials },
      create: {
        id: prov.id,
        tenantId: this.getTenantIdOrThrow(),
        name: prov.name,
        status: prov.status,
        credentials: prov.credentials,
      },
    });
  }
}

export class GlobalLoadBalancerRepository extends BaseTenantRepository {
  async save(glb: GlobalLoadBalancer): Promise<void> {
    await prisma.globalLoadBalancer.upsert({
      where: { id: glb.id },
      update: { status: glb.status },
      create: {
        id: glb.id,
        tenantId: this.getTenantIdOrThrow(),
        name: glb.name,
        dnsName: glb.dnsName,
        routing: glb.routing,
        status: glb.status,
      },
    });
  }
}

export class TrafficPolicyRepository extends BaseTenantRepository {
  async save(policy: TrafficPolicy): Promise<void> {
    await prisma.trafficPolicy.upsert({
      where: { id: policy.id },
      update: { policyJson: policy.policyJson },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        name: policy.name,
        policyJson: policy.policyJson,
      },
    });
  }
}

export class GeoRoutingRuleRepository extends BaseTenantRepository {
  async save(rule: GeoRoutingRule): Promise<void> {
    await prisma.geoRoutingRule.upsert({
      where: { id: rule.id },
      update: { targetUrl: rule.targetUrl },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        country: rule.country,
        regionName: rule.regionName,
        targetUrl: rule.targetUrl,
      },
    });
  }
}

export class DisasterRecoveryPlanRepository extends BaseTenantRepository {
  async save(plan: DisasterRecoveryPlan): Promise<void> {
    await prisma.disasterRecoveryPlan.upsert({
      where: { id: plan.id },
      update: { isActive: plan.isActive, stepsJson: plan.stepsJson },
      create: {
        id: plan.id,
        tenantId: this.getTenantIdOrThrow(),
        name: plan.name,
        rpoMinutes: plan.rpoMinutes,
        rtoMinutes: plan.rtoMinutes,
        stepsJson: plan.stepsJson,
        isActive: plan.isActive,
      },
    });
  }
}

export class RecoveryExecutionRepository extends BaseTenantRepository {
  async save(exec: RecoveryExecution): Promise<void> {
    await prisma.recoveryExecution.upsert({
      where: { id: exec.id },
      update: { status: exec.status, finishedAt: exec.finishedAt },
      create: {
        id: exec.id,
        tenantId: this.getTenantIdOrThrow(),
        planId: exec.planId,
        status: exec.status,
        startedAt: exec.startedAt,
        finishedAt: exec.finishedAt,
      },
    });
  }
}

export class BackupPolicyRepository extends BaseTenantRepository {
  async save(policy: BackupPolicy): Promise<void> {
    await prisma.backupPolicy.upsert({
      where: { id: policy.id },
      update: { schedule: policy.schedule, retention: policy.retention },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        name: policy.name,
        schedule: policy.schedule,
        retention: policy.retention,
      },
    });
  }
}

export class RestoreOperationRepository extends BaseTenantRepository {
  async save(op: RestoreOperation): Promise<void> {
    await prisma.restoreOperation.upsert({
      where: { id: op.id },
      update: { status: op.status, finishedAt: op.finishedAt },
      create: {
        id: op.id,
        tenantId: this.getTenantIdOrThrow(),
        snapshotId: op.snapshotId,
        status: op.status,
        startedAt: op.startedAt,
        finishedAt: op.finishedAt,
      },
    });
  }
}

export class InfrastructureHealthRepository extends BaseTenantRepository {
  async save(log: InfrastructureHealth): Promise<void> {
    await prisma.infrastructureHealth.create({
      data: {
        id: log.id,
        tenantId: this.getTenantIdOrThrow(),
        resource: log.resource,
        status: log.status,
        checkedAt: log.checkedAt,
      },
    });
  }
}

export class InfrastructureAlertRepository extends BaseTenantRepository {
  async save(alert: InfrastructureAlert): Promise<void> {
    await prisma.infrastructureAlert.upsert({
      where: { id: alert.id },
      update: { isResolved: alert.isResolved },
      create: {
        id: alert.id,
        tenantId: this.getTenantIdOrThrow(),
        severity: alert.severity,
        message: alert.message,
        isResolved: alert.isResolved,
      },
    });
  }
}

export class InfrastructureMetricRepository extends BaseTenantRepository {
  async save(metric: InfrastructureMetric): Promise<void> {
    await prisma.infrastructureMetric.create({
      data: {
        id: metric.id,
        tenantId: this.getTenantIdOrThrow(),
        metricName: metric.metricName,
        metricValue: metric.metricValue,
        recordedAt: metric.recordedAt,
      },
    });
  }
}

export class ServiceEndpointRepository extends BaseTenantRepository {
  async save(endpoint: ServiceEndpoint): Promise<void> {
    await prisma.serviceEndpoint.upsert({
      where: { id: endpoint.id },
      update: { status: endpoint.status, url: endpoint.url },
      create: {
        id: endpoint.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: endpoint.serviceName,
        url: endpoint.url,
        region: endpoint.region,
        status: endpoint.status,
      },
    });
  }
}

export class ServiceDiscoveryRecordRepository extends BaseTenantRepository {
  async save(rec: ServiceDiscoveryRecord): Promise<void> {
    await prisma.serviceDiscoveryRecord.upsert({
      where: { id: rec.id },
      update: { status: rec.status },
      create: {
        id: rec.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: rec.serviceName,
        ipAddress: rec.ipAddress,
        port: rec.port,
        status: rec.status,
      },
    });
  }
}

export class InfrastructureCertificateRepository extends BaseTenantRepository {
  async save(cert: InfrastructureCertificate): Promise<void> {
    await prisma.infrastructureCertificate.upsert({
      where: { id: cert.id },
      update: { status: cert.status },
      create: {
        id: cert.id,
        tenantId: this.getTenantIdOrThrow(),
        domainName: cert.domainName,
        expiresAt: cert.expiresAt,
        status: cert.status,
      },
    });
  }
}
