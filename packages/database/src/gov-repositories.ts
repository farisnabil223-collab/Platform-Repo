import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import { CompliancePolicy, AuditEntry, RiskRegisterItem, UserConsentHistory } from '@eduverse/kernel';

export class CompliancePolicyRepository extends BaseTenantRepository {
  async save(policy: CompliancePolicy): Promise<void> {
    await prisma.compliancePolicy.upsert({
      where: { code: policy.code },
      update: {
        framework: policy.framework,
        contentTemplate: policy.contentTemplate,
        version: policy.policyVersion,
        status: policy.status,
        assignedRoles: policy.assignedRoles,
      },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        code: policy.code,
        framework: policy.framework,
        contentTemplate: policy.contentTemplate,
        version: policy.policyVersion,
        status: policy.status,
        assignedRoles: policy.assignedRoles,
      },
    });
  }

  async findMany(): Promise<CompliancePolicy[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.compliancePolicy.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new CompliancePolicy(item.id, {
      tenantId: item.tenantId,
      code: item.code,
      framework: item.framework,
      contentTemplate: item.contentTemplate,
      version: item.version,
      status: item.status,
      assignedRoles: item.assignedRoles,
    }));
  }
}

export class AuditEntryRepository extends BaseTenantRepository {
  async save(entry: AuditEntry): Promise<void> {
    await prisma.auditEntry.create({
      data: {
        id: entry.id,
        tenantId: this.getTenantIdOrThrow(),
        action: entry.action,
        actorId: entry.actorId,
        payload: entry.payload,
        signature: entry.signature,
        hashChain: entry.hashChain,
      },
    });
  }

  async findMany(): Promise<AuditEntry[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.auditEntry.findMany({
      where: { tenantId },
      orderBy: { occurredAt: 'asc' },
    });
    return list.map((item: any) => new AuditEntry(item.id, {
      tenantId: item.tenantId,
      action: item.action,
      actorId: item.actorId,
      payload: item.payload,
      signature: item.signature,
      hashChain: item.hashChain,
    }));
  }
}

export class RiskRegisterItemRepository extends BaseTenantRepository {
  async save(item: RiskRegisterItem): Promise<void> {
    await prisma.riskRegisterItem.create({
      data: {
        id: item.id,
        tenantId: this.getTenantIdOrThrow(),
        title: item.title,
        category: item.category,
        probability: item.probability,
        impact: item.impact,
        score: item.score,
        residualRisk: item.residualRisk,
        mitigationPlan: item.mitigationPlan,
        status: item.status,
      },
    });
  }

  async findMany(): Promise<RiskRegisterItem[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.riskRegisterItem.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new RiskRegisterItem(item.id, {
      tenantId: item.tenantId,
      title: item.title,
      category: item.category,
      probability: item.probability,
      impact: item.impact,
      score: item.score,
      residualRisk: item.residualRisk,
      mitigationPlan: item.mitigationPlan,
      status: item.status,
    }));
  }
}

export class UserConsentHistoryRepository extends BaseTenantRepository {
  async save(consent: UserConsentHistory): Promise<void> {
    await prisma.userConsentHistory.create({
      data: {
        id: consent.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: consent.userId,
        granted: consent.granted,
        purpose: consent.purpose,
      },
    });
  }

  async findMany(): Promise<UserConsentHistory[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.userConsentHistory.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new UserConsentHistory(item.id, {
      tenantId: item.tenantId,
      userId: item.userId,
      granted: item.granted,
      purpose: item.purpose,
    }));
  }
}
