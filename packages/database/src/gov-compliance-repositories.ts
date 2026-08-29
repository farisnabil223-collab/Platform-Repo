import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  GovernancePolicyVersion,
  GovernanceApprovalWorkflow,
  ComplianceFramework,
  ComplianceControl,
  ComplianceAssessment,
  ComplianceViolation,
  ComplianceAudit,
  PrivacyConsent,
  PrivacyRequest,
  DataClassification,
  DataCatalog,
  DataAsset,
  DataLineage,
  DataOwner,
  DataSteward,
  MetadataRegistry,
  RetentionSchedule,
  LegalHold,
  DataResidencyRule,
  DataTransferPolicy,
  RiskRegister,
  RiskMitigation,
  RiskControl,
  BusinessImpactAssessment,
  ExceptionRequest,
  ControlReview,
  ComplianceDashboard
} from '@eduverse/kernel';

export class GovernancePolicyVersionRepository extends BaseTenantRepository {
  async save(version: GovernancePolicyVersion): Promise<void> {
    await prisma.governancePolicyVersion.upsert({
      where: { id: version.id },
      update: { status: version.status },
      create: {
        id: version.id,
        tenantId: this.getTenantIdOrThrow(),
        policyId: version.policyId,
        version: version.policyVersion,
        content: version.content,
        status: version.status,
      },
    });
  }
}

export class GovernanceApprovalWorkflowRepository extends BaseTenantRepository {
  async save(workflow: GovernanceApprovalWorkflow): Promise<void> {
    await prisma.governanceApprovalWorkflow.upsert({
      where: { id: workflow.id },
      update: { status: workflow.status },
      create: {
        id: workflow.id,
        tenantId: this.getTenantIdOrThrow(),
        targetType: workflow.targetType,
        targetId: workflow.targetId,
        status: workflow.status,
        approver: workflow.approver,
      },
    });
  }
}

export class ComplianceFrameworkRepository extends BaseTenantRepository {
  async save(framework: ComplianceFramework): Promise<void> {
    await prisma.complianceFramework.upsert({
      where: { id: framework.id },
      update: { description: framework.description },
      create: {
        id: framework.id,
        tenantId: this.getTenantIdOrThrow(),
        name: framework.name,
        description: framework.description,
        version: framework.frameworkVersion,
      },
    });
  }
}

export class ComplianceControlRepository extends BaseTenantRepository {
  async save(control: ComplianceControl): Promise<void> {
    await prisma.complianceControl.upsert({
      where: { id: control.id },
      update: { status: control.status },
      create: {
        id: control.id,
        tenantId: this.getTenantIdOrThrow(),
        frameworkId: control.frameworkId,
        controlCode: control.controlCode,
        title: control.title,
        status: control.status,
      },
    });
  }
}

export class ComplianceAssessmentRepository extends BaseTenantRepository {
  async save(assessment: ComplianceAssessment): Promise<void> {
    await prisma.complianceAssessment.upsert({
      where: { id: assessment.id },
      update: { score: assessment.score, status: assessment.status },
      create: {
        id: assessment.id,
        tenantId: this.getTenantIdOrThrow(),
        frameworkId: assessment.frameworkId,
        score: assessment.score,
        status: assessment.status,
      },
    });
  }
}

export class ComplianceViolationRepository extends BaseTenantRepository {
  async save(violation: ComplianceViolation): Promise<void> {
    await prisma.complianceViolation.create({
      data: {
        id: violation.id,
        tenantId: this.getTenantIdOrThrow(),
        controlId: violation.controlId,
        description: violation.description,
        severity: violation.severity,
      },
    });
  }
}

export class ComplianceAuditRepository extends BaseTenantRepository {
  async save(audit: ComplianceAudit): Promise<void> {
    await prisma.complianceAudit.upsert({
      where: { id: audit.id },
      update: { status: audit.status },
      create: {
        id: audit.id,
        tenantId: this.getTenantIdOrThrow(),
        auditor: audit.auditor,
        scope: audit.scope,
        status: audit.status,
      },
    });
  }
}

export class PrivacyConsentRepository extends BaseTenantRepository {
  async save(consent: PrivacyConsent): Promise<void> {
    await prisma.privacyConsent.upsert({
      where: { id: consent.id },
      update: { isGranted: consent.isGranted },
      create: {
        id: consent.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: consent.userId,
        consentType: consent.consentType,
        isGranted: consent.isGranted,
      },
    });
  }
}

export class PrivacyRequestRepository extends BaseTenantRepository {
  async save(req: PrivacyRequest): Promise<void> {
    await prisma.privacyRequest.upsert({
      where: { id: req.id },
      update: { status: req.status },
      create: {
        id: req.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: req.userId,
        requestType: req.requestType,
        status: req.status,
      },
    });
  }
}

export class DataClassificationRepository extends BaseTenantRepository {
  async save(classif: DataClassification): Promise<void> {
    await prisma.dataClassification.upsert({
      where: { id: classif.id },
      update: { level: classif.level, reason: classif.reason },
      create: {
        id: classif.id,
        tenantId: this.getTenantIdOrThrow(),
        assetId: classif.assetId,
        level: classif.level,
        reason: classif.reason,
      },
    });
  }
}

export class DataCatalogRepository extends BaseTenantRepository {
  async save(catalog: DataCatalog): Promise<void> {
    await prisma.dataCatalog.upsert({
      where: { id: catalog.id },
      update: { description: catalog.description },
      create: {
        id: catalog.id,
        tenantId: this.getTenantIdOrThrow(),
        name: catalog.name,
        description: catalog.description,
      },
    });
  }
}

export class DataAssetRepository extends BaseTenantRepository {
  async save(asset: DataAsset): Promise<void> {
    await prisma.dataAsset.upsert({
      where: { id: asset.id },
      update: { name: asset.name },
      create: {
        id: asset.id,
        tenantId: this.getTenantIdOrThrow(),
        catalogId: asset.catalogId,
        name: asset.name,
        assetType: asset.assetType,
      },
    });
  }
}

export class DataLineageRepository extends BaseTenantRepository {
  async save(lineage: DataLineage): Promise<void> {
    await prisma.dataLineage.upsert({
      where: { id: lineage.id },
      update: { flowDetails: lineage.flowDetails },
      create: {
        id: lineage.id,
        tenantId: this.getTenantIdOrThrow(),
        sourceAsset: lineage.sourceAsset,
        targetAsset: lineage.targetAsset,
        flowDetails: lineage.flowDetails,
      },
    });
  }
}

export class DataOwnerRepository extends BaseTenantRepository {
  async save(owner: DataOwner): Promise<void> {
    await prisma.dataOwner.create({
      data: {
        id: owner.id,
        tenantId: this.getTenantIdOrThrow(),
        assetId: owner.assetId,
        ownerEmail: owner.ownerEmail,
      },
    });
  }
}

export class DataStewardRepository extends BaseTenantRepository {
  async save(steward: DataSteward): Promise<void> {
    await prisma.dataSteward.create({
      data: {
        id: steward.id,
        tenantId: this.getTenantIdOrThrow(),
        assetId: steward.assetId,
        stewardEmail: steward.stewardEmail,
      },
    });
  }
}

export class MetadataRegistryRepository extends BaseTenantRepository {
  async save(reg: MetadataRegistry): Promise<void> {
    await prisma.metadataRegistry.upsert({
      where: { id: reg.id },
      update: { metaValue: reg.metaValue },
      create: {
        id: reg.id,
        tenantId: this.getTenantIdOrThrow(),
        assetId: reg.assetId,
        metaKey: reg.metaKey,
        metaValue: reg.metaValue,
      },
    });
  }
}

export class RetentionScheduleRepository extends BaseTenantRepository {
  async save(sched: RetentionSchedule): Promise<void> {
    await prisma.retentionSchedule.upsert({
      where: { id: sched.id },
      update: { status: sched.status },
      create: {
        id: sched.id,
        tenantId: this.getTenantIdOrThrow(),
        policyId: sched.policyId,
        nextPurgeAt: sched.nextPurgeAt,
        status: sched.status,
      },
    });
  }
}

export class LegalHoldRepository extends BaseTenantRepository {
  async save(hold: LegalHold): Promise<void> {
    await prisma.legalHold.upsert({
      where: { id: hold.id },
      update: { isActive: hold.isActive },
      create: {
        id: hold.id,
        tenantId: this.getTenantIdOrThrow(),
        caseName: hold.caseName,
        targetType: hold.targetType,
        targetId: hold.targetId,
        isActive: hold.isActive,
      },
    });
  }
}

export class DataResidencyRuleRepository extends BaseTenantRepository {
  async save(rule: DataResidencyRule): Promise<void> {
    await prisma.dataResidencyRule.upsert({
      where: { id: rule.id },
      update: { isEnforced: rule.isEnforced },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        regionCode: rule.regionCode,
        storagePath: rule.storagePath,
        isEnforced: rule.isEnforced,
      },
    });
  }
}

export class DataTransferPolicyRepository extends BaseTenantRepository {
  async save(policy: DataTransferPolicy): Promise<void> {
    await prisma.dataTransferPolicy.upsert({
      where: { id: policy.id },
      update: { transferCheck: policy.transferCheck },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        sourceRegion: policy.sourceRegion,
        targetRegion: policy.targetRegion,
        transferCheck: policy.transferCheck,
      },
    });
  }
}

export class RiskRegisterRepository extends BaseTenantRepository {
  async save(risk: RiskRegister): Promise<void> {
    await prisma.riskRegister.upsert({
      where: { id: risk.id },
      update: { status: risk.status },
      create: {
        id: risk.id,
        tenantId: this.getTenantIdOrThrow(),
        title: risk.title,
        description: risk.description,
        status: risk.status,
      },
    });
  }
}

export class RiskMitigationRepository extends BaseTenantRepository {
  async save(mitig: RiskMitigation): Promise<void> {
    await prisma.riskMitigation.upsert({
      where: { id: mitig.id },
      update: { status: mitig.status },
      create: {
        id: mitig.id,
        tenantId: this.getTenantIdOrThrow(),
        riskId: mitig.riskId,
        planDetails: mitig.planDetails,
        costLimit: mitig.costLimit,
        status: mitig.status,
      },
    });
  }
}

export class RiskControlRepository extends BaseTenantRepository {
  async save(ctrl: RiskControl): Promise<void> {
    await prisma.riskControl.upsert({
      where: { id: ctrl.id },
      update: { isEffective: ctrl.isEffective },
      create: {
        id: ctrl.id,
        tenantId: this.getTenantIdOrThrow(),
        riskId: ctrl.riskId,
        controlCode: ctrl.controlCode,
        isEffective: ctrl.isEffective,
      },
    });
  }
}

export class BusinessImpactAssessmentRepository extends BaseTenantRepository {
  async save(bia: BusinessImpactAssessment): Promise<void> {
    await prisma.businessImpactAssessment.upsert({
      where: { id: bia.id },
      update: { criticality: bia.criticality },
      create: {
        id: bia.id,
        tenantId: this.getTenantIdOrThrow(),
        serviceName: bia.serviceName,
        rtoMinutes: bia.rtoMinutes,
        rpoMinutes: bia.rpoMinutes,
        criticality: bia.criticality,
      },
    });
  }
}

export class ExceptionRequestRepository extends BaseTenantRepository {
  async save(req: ExceptionRequest): Promise<void> {
    await prisma.exceptionRequest.upsert({
      where: { id: req.id },
      update: { status: req.status },
      create: {
        id: req.id,
        tenantId: this.getTenantIdOrThrow(),
        policyId: req.policyId,
        reason: req.reason,
        expiresAt: req.expiresAt,
        status: req.status,
      },
    });
  }
}

export class ControlReviewRepository extends BaseTenantRepository {
  async save(review: ControlReview): Promise<void> {
    await prisma.controlReview.upsert({
      where: { id: review.id },
      update: { status: review.status },
      create: {
        id: review.id,
        tenantId: this.getTenantIdOrThrow(),
        controlId: review.controlId,
        status: review.status,
        reviewer: review.reviewer,
      },
    });
  }
}

export class ComplianceDashboardRepository extends BaseTenantRepository {
  async save(dash: ComplianceDashboard): Promise<void> {
    await prisma.complianceDashboard.create({
      data: {
        id: dash.id,
        tenantId: this.getTenantIdOrThrow(),
        frameworkCount: dash.frameworkCount,
        controlCount: dash.controlCount,
        violationCount: dash.violationCount,
        openRiskCount: dash.openRiskCount,
      },
    });
  }
}
