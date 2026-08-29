import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  DevPortalApp,
  GitOpsApp,
  ReleaseTrain,
  DeploymentPipeline,
  PlatformScorecard,
  FinOpsAllocation,
  SloTracker,
  ResilienceDependency,
  PlatformInventory
} from '@eduverse/kernel';

export class DevPortalAppRepository extends BaseTenantRepository {
  async save(app: DevPortalApp): Promise<void> {
    await prisma.devPortalApp.upsert({
      where: { id: app.id },
      update: { status: app.status },
      create: {
        id: app.id,
        tenantId: this.getTenantIdOrThrow(),
        appName: app.appName,
        templateId: app.templateId,
        status: app.status,
      },
    });
  }
}

export class GitOpsAppRepository extends BaseTenantRepository {
  async save(app: GitOpsApp): Promise<void> {
    await prisma.gitOpsApp.upsert({
      where: { id: app.id },
      update: { syncStatus: app.syncStatus, driftDetected: app.driftDetected },
      create: {
        id: app.id,
        tenantId: this.getTenantIdOrThrow(),
        repoUrl: app.repoUrl,
        targetBranch: app.targetBranch,
        syncStatus: app.syncStatus,
        driftDetected: app.driftDetected,
      },
    });
  }
}

export class ReleaseTrainRepository extends BaseTenantRepository {
  async save(train: ReleaseTrain): Promise<void> {
    await prisma.releaseTrain.upsert({
      where: { id: train.id },
      update: { status: train.status },
      create: {
        id: train.id,
        tenantId: this.getTenantIdOrThrow(),
        trainName: train.trainName,
        status: train.status,
        releaseDate: train.releaseDate,
      },
    });
  }
}

export class DeploymentPipelineRepository extends BaseTenantRepository {
  async save(pipeline: DeploymentPipeline): Promise<void> {
    await prisma.deploymentPipeline.upsert({
      where: { id: pipeline.id },
      update: { activeStage: pipeline.activeStage, gatesStatus: pipeline.gatesStatus },
      create: {
        id: pipeline.id,
        tenantId: this.getTenantIdOrThrow(),
        pipelineName: pipeline.pipelineName,
        activeStage: pipeline.activeStage,
        gatesStatus: pipeline.gatesStatus,
      },
    });
  }
}

export class PlatformScorecardRepository extends BaseTenantRepository {
  async save(card: PlatformScorecard): Promise<void> {
    await prisma.platformScorecard.create({
      data: {
        id: card.id,
        tenantId: this.getTenantIdOrThrow(),
        reliability: card.reliability,
        availability: card.availability,
        performance: card.performance,
        security: card.security,
        compliance: card.compliance,
        operational: card.operational,
      },
    });
  }
}

export class FinOpsAllocationRepository extends BaseTenantRepository {
  async save(alloc: FinOpsAllocation): Promise<void> {
    await prisma.finOpsAllocation.create({
      data: {
        id: alloc.id,
        tenantId: this.getTenantIdOrThrow(),
        costCenter: alloc.costCenter,
        chargeback: alloc.chargeback,
        showback: alloc.showback,
        budgetLimit: alloc.budgetLimit,
      },
    });
  }
}

export class SloTrackerRepository extends BaseTenantRepository {
  async save(tracker: SloTracker): Promise<void> {
    await prisma.sloTracker.upsert({
      where: { id: tracker.id },
      update: { errorBudget: tracker.errorBudget, burnRate: tracker.burnRate },
      create: {
        id: tracker.id,
        tenantId: this.getTenantIdOrThrow(),
        sliName: tracker.sliName,
        sloTarget: tracker.sloTarget,
        errorBudget: tracker.errorBudget,
        burnRate: tracker.burnRate,
      },
    });
  }
}

export class ResilienceDependencyRepository extends BaseTenantRepository {
  async save(dep: ResilienceDependency): Promise<void> {
    await prisma.resilienceDependency.upsert({
      where: { id: dep.id },
      update: { blastRadius: dep.blastRadius, criticalLevel: dep.criticalLevel },
      create: {
        id: dep.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: dep.serviceName,
        dependsOn: dep.dependsOn,
        blastRadius: dep.blastRadius,
        criticalLevel: dep.criticalLevel,
      },
    });
  }
}

export class PlatformInventoryRepository extends BaseTenantRepository {
  async save(inv: PlatformInventory): Promise<void> {
    await prisma.platformInventory.create({
      data: {
        id: inv.id,
        tenantId: this.getTenantIdOrThrow(),
        clusterCount: inv.clusterCount,
        serviceCount: inv.serviceCount,
        runbookCount: inv.runbookCount,
      },
    });
  }
}
