import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  SubscriptionPlan,
  SubscriptionFeature,
  SubscriptionCycle,
  SubscriptionAddon,
  UsageRecord,
  UsageQuota,
  BillingAccount,
  InvoiceItem,
  PaymentProvider,
  Refund,
  CreditBalance,
  Promotion,
  DiscountRule,
  TaxProfile,
  TaxRule,
  License,
  LicenseSeat,
  LicenseAssignment,
  OrganizationContract,
  EnterpriseAgreement,
  MarketplaceProduct,
  MarketplaceOrder,
  MarketplacePublisher,
  MarketplaceRevenue,
  Partner,
  PartnerCommission,
  Reseller,
  CustomerPortalProfile,
  CustomerSupportTicket,
  CustomerHealthScore,
  CustomerSuccessPlaybook,
  RevenueMetric,
  MRRSnapshot,
  ARRSnapshot,
  ChurnMetric,
  ExpansionRevenue
} from '@eduverse/kernel';

export class SubscriptionPlanRepository extends BaseTenantRepository {
  async save(plan: SubscriptionPlan): Promise<void> {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: { price: plan.price },
      create: {
        id: plan.id,
        name: plan.name,
        code: `plan_${plan.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        interval: plan.billingCycle,
        price: plan.price,
        currency: 'USD',
        trialDays: 0,
      },
    });
  }
}

export class SubscriptionFeatureRepository extends BaseTenantRepository {
  async save(feature: SubscriptionFeature): Promise<void> {
    await prisma.subscriptionFeature.upsert({
      where: { id: feature.id },
      update: { isEnabled: feature.isEnabled },
      create: {
        id: feature.id,
        tenantId: this.getTenantIdOrThrow(),
        planId: feature.planId,
        featureKey: feature.featureKey,
        isEnabled: feature.isEnabled,
      },
    });
  }
}

export class SubscriptionCycleRepository extends BaseTenantRepository {
  async save(cycle: SubscriptionCycle): Promise<void> {
    await prisma.subscriptionCycle.upsert({
      where: { id: cycle.id },
      update: { status: cycle.status },
      create: {
        id: cycle.id,
        tenantId: this.getTenantIdOrThrow(),
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        status: cycle.status,
      },
    });
  }
}

export class SubscriptionAddonRepository extends BaseTenantRepository {
  async save(addon: SubscriptionAddon): Promise<void> {
    await prisma.subscriptionAddon.upsert({
      where: { id: addon.id },
      update: { price: addon.price },
      create: {
        id: addon.id,
        tenantId: this.getTenantIdOrThrow(),
        subId: addon.subId,
        addonKey: addon.addonKey,
        price: addon.price,
      },
    });
  }
}

export class UsageRecordRepository extends BaseTenantRepository {
  async save(record: UsageRecord): Promise<void> {
    await prisma.usageRecord.create({
      data: {
        id: record.id,
        tenantId: this.getTenantIdOrThrow(),
        subId: record.subId,
        metricType: record.metricType,
        quantity: record.quantity,
      },
    });
  }
}

export class UsageQuotaRepository extends BaseTenantRepository {
  async save(quota: UsageQuota): Promise<void> {
    await prisma.usageQuota.upsert({
      where: { id: quota.id },
      update: { currentVal: quota.currentVal },
      create: {
        id: quota.id,
        tenantId: this.getTenantIdOrThrow(),
        metricType: quota.metricType,
        limitVal: quota.limitVal,
        currentVal: quota.currentVal,
      },
    });
  }
}

export class BillingAccountRepository extends BaseTenantRepository {
  async save(account: BillingAccount): Promise<void> {
    await prisma.billingAccount.upsert({
      where: { id: account.id },
      update: { status: account.status },
      create: {
        id: account.id,
        tenantId: this.getTenantIdOrThrow(),
        companyName: account.companyName,
        email: account.email,
        status: account.status,
      },
    });
  }
}

export class InvoiceItemRepository extends BaseTenantRepository {
  async save(item: InvoiceItem): Promise<void> {
    await prisma.invoiceItem.upsert({
      where: { id: item.id },
      update: { totalAmount: item.amount },
      create: {
        id: item.id,
        invoiceId: item.invoiceId,
        description: item.description,
        quantity: 1,
        unitPrice: item.amount,
        taxRate: 0.0,
        taxAmount: 0.0,
        totalAmount: item.amount,
      },
    });
  }
}

export class PaymentProviderRepository extends BaseTenantRepository {
  async save(provider: PaymentProvider): Promise<void> {
    await prisma.paymentProvider.upsert({
      where: { id: provider.id },
      update: { isActive: provider.isActive },
      create: {
        id: provider.id,
        tenantId: this.getTenantIdOrThrow(),
        providerName: provider.providerName,
        apiKey: provider.apiKey,
        isActive: provider.isActive,
      },
    });
  }
}

export class RefundRepository extends BaseTenantRepository {
  async save(refund: Refund): Promise<void> {
    await prisma.refund.upsert({
      where: { id: refund.id },
      update: { amount: refund.amount },
      create: {
        id: refund.id,
        paymentId: refund.paymentId,
        amount: refund.amount,
        reason: 'Requested by customer success',
        status: 'SUCCESS',
      },
    });
  }
}

export class CreditBalanceRepository extends BaseTenantRepository {
  async save(balance: CreditBalance): Promise<void> {
    await prisma.creditBalance.upsert({
      where: { id: balance.id },
      update: { balance: balance.balance },
      create: {
        id: balance.id,
        tenantId: this.getTenantIdOrThrow(),
        accountId: balance.accountId,
        balance: balance.balance,
      },
    });
  }
}

export class PromotionRepository extends BaseTenantRepository {
  async save(promo: Promotion): Promise<void> {
    await prisma.promotion.upsert({
      where: { id: promo.id },
      update: { name: promo.name },
      create: {
        id: promo.id,
        tenantId: this.getTenantIdOrThrow(),
        name: promo.name,
        couponId: promo.couponId,
        expiresAt: promo.expiresAt,
      },
    });
  }
}

export class DiscountRuleRepository extends BaseTenantRepository {
  async save(rule: DiscountRule): Promise<void> {
    await prisma.discountRule.upsert({
      where: { id: rule.id },
      update: { name: rule.name },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        name: rule.name,
        ruleJson: rule.ruleJson,
      },
    });
  }
}

export class TaxProfileRepository extends BaseTenantRepository {
  async save(profile: TaxProfile): Promise<void> {
    await prisma.taxProfile.upsert({
      where: { id: profile.id },
      update: { vatRate: 0.15 },
      create: {
        id: profile.id,
        country: profile.countryCode,
        vatRate: 0.15,
        gstRate: 0.0,
        isExempt: false,
      },
    });
  }
}

export class TaxRuleRepository extends BaseTenantRepository {
  async save(rule: TaxRule): Promise<void> {
    await prisma.taxRule.upsert({
      where: { id: rule.id },
      update: { rate: rule.rate },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        country: rule.country,
        rate: rule.rate,
        ruleType: rule.ruleType,
      },
    });
  }
}

export class LicenseRepository extends BaseTenantRepository {
  async save(lic: License): Promise<void> {
    await prisma.license.upsert({
      where: { id: lic.id },
      update: { status: lic.status },
      create: {
        id: lic.id,
        tenantId: this.getTenantIdOrThrow(),
        licenseKey: lic.licenseKey,
        status: lic.status,
        expiresAt: lic.expiresAt,
      },
    });
  }
}

export class LicenseSeatRepository extends BaseTenantRepository {
  async save(seat: LicenseSeat): Promise<void> {
    await prisma.licenseSeat.upsert({
      where: { id: seat.id },
      update: { isAssigned: seat.isAssigned },
      create: {
        id: seat.id,
        tenantId: this.getTenantIdOrThrow(),
        licenseId: seat.licenseId,
        seatCode: seat.seatCode,
        isAssigned: seat.isAssigned,
      },
    });
  }
}

export class LicenseAssignmentRepository extends BaseTenantRepository {
  async save(assign: LicenseAssignment): Promise<void> {
    await prisma.licenseAssignment.create({
      data: {
        id: assign.id,
        tenantId: this.getTenantIdOrThrow(),
        seatId: assign.seatId,
        assignedTo: assign.assignedTo,
      },
    });
  }
}

export class OrganizationContractRepository extends BaseTenantRepository {
  async save(contract: OrganizationContract): Promise<void> {
    await prisma.organizationContract.upsert({
      where: { id: contract.id },
      update: { isActive: contract.isActive },
      create: {
        id: contract.id,
        tenantId: this.getTenantIdOrThrow(),
        contractRef: contract.contractRef,
        value: contract.value,
        isActive: contract.isActive,
      },
    });
  }
}

export class EnterpriseAgreementRepository extends BaseTenantRepository {
  async save(agree: EnterpriseAgreement): Promise<void> {
    await prisma.enterpriseAgreement.upsert({
      where: { id: agree.id },
      update: { slaTier: agree.slaTier },
      create: {
        id: agree.id,
        tenantId: this.getTenantIdOrThrow(),
        agreementRef: agree.agreementRef,
        slaTier: agree.slaTier,
        signedAt: agree.signedAt,
      },
    });
  }
}

export class MarketplaceProductRepository extends BaseTenantRepository {
  async save(product: MarketplaceProduct): Promise<void> {
    await prisma.marketplaceProduct.upsert({
      where: { id: product.id },
      update: { price: product.price },
      create: {
        id: product.id,
        tenantId: this.getTenantIdOrThrow(),
        name: product.name,
        price: product.price,
        productType: product.productType,
        publisherId: product.publisherId,
      },
    });
  }
}

export class MarketplaceOrderRepository extends BaseTenantRepository {
  async save(order: MarketplaceOrder): Promise<void> {
    await prisma.marketplaceOrder.create({
      data: {
        id: order.id,
        tenantId: this.getTenantIdOrThrow(),
        productId: order.productId,
        amount: order.amount,
      },
    });
  }
}

export class MarketplacePublisherRepository extends BaseTenantRepository {
  async save(pub: MarketplacePublisher): Promise<void> {
    await prisma.marketplacePublisher.upsert({
      where: { id: pub.id },
      update: { email: pub.email },
      create: {
        id: pub.id,
        tenantId: this.getTenantIdOrThrow(),
        name: pub.name,
        email: pub.email,
        payoutMethod: pub.payoutMethod,
      },
    });
  }
}

export class MarketplaceRevenueRepository extends BaseTenantRepository {
  async save(rev: MarketplaceRevenue): Promise<void> {
    await prisma.marketplaceRevenue.create({
      data: {
        id: rev.id,
        tenantId: this.getTenantIdOrThrow(),
        orderId: rev.orderId,
        publisherCut: rev.publisherCut,
        platformCut: rev.platformCut,
      },
    });
  }
}

export class PartnerRepository extends BaseTenantRepository {
  async save(partner: Partner): Promise<void> {
    await prisma.partner.upsert({
      where: { id: partner.id },
      update: { commissionPct: partner.commissionPct },
      create: {
        id: partner.id,
        tenantId: this.getTenantIdOrThrow(),
        name: partner.name,
        commissionPct: partner.commissionPct,
      },
    });
  }
}

export class PartnerCommissionRepository extends BaseTenantRepository {
  async save(comm: PartnerCommission): Promise<void> {
    await prisma.partnerCommission.create({
      data: {
        id: comm.id,
        tenantId: this.getTenantIdOrThrow(),
        partnerId: comm.partnerId,
        amount: comm.amount,
        payoutStatus: comm.payoutStatus,
      },
    });
  }
}

export class ResellerRepository extends BaseTenantRepository {
  async save(res: Reseller): Promise<void> {
    await prisma.reseller.upsert({
      where: { id: res.id },
      update: { discountPct: res.discountPct },
      create: {
        id: res.id,
        tenantId: this.getTenantIdOrThrow(),
        name: res.name,
        discountPct: res.discountPct,
      },
    });
  }
}

export class CustomerPortalProfileRepository extends BaseTenantRepository {
  async save(prof: CustomerPortalProfile): Promise<void> {
    await prisma.customerPortalProfile.upsert({
      where: { id: prof.id },
      update: { companyName: prof.companyName },
      create: {
        id: prof.id,
        tenantId: this.getTenantIdOrThrow(),
        companyName: prof.companyName,
        themeConfig: prof.themeConfig,
      },
    });
  }
}

export class CustomerSupportTicketRepository extends BaseTenantRepository {
  async save(ticket: CustomerSupportTicket): Promise<void> {
    await prisma.customerSupportTicket.upsert({
      where: { id: ticket.id },
      update: { status: ticket.status },
      create: {
        id: ticket.id,
        tenantId: this.getTenantIdOrThrow(),
        subject: ticket.subject,
        severity: ticket.subject,
        status: ticket.status,
      },
    });
  }
}

export class CustomerHealthScoreRepository extends BaseTenantRepository {
  async save(health: CustomerHealthScore): Promise<void> {
    await prisma.customerHealthScore.create({
      data: {
        id: health.id,
        tenantId: this.getTenantIdOrThrow(),
        score: health.score,
        riskLevel: health.riskLevel,
      },
    });
  }
}

export class CustomerSuccessPlaybookRepository extends BaseTenantRepository {
  async save(playbook: CustomerSuccessPlaybook): Promise<void> {
    await prisma.customerSuccessPlaybook.upsert({
      where: { id: playbook.id },
      update: { status: playbook.status },
      create: {
        id: playbook.id,
        tenantId: this.getTenantIdOrThrow(),
        name: playbook.name,
        stepsJson: playbook.stepsJson,
        status: playbook.status,
      },
    });
  }
}

export class RevenueMetricRepository extends BaseTenantRepository {
  async save(metric: RevenueMetric): Promise<void> {
    await prisma.revenueMetric.create({
      data: {
        id: metric.id,
        tenantId: this.getTenantIdOrThrow(),
        metricType: metric.metricType,
        value: metric.value,
      },
    });
  }
}

export class MRRSnapshotRepository extends BaseTenantRepository {
  async save(snap: MRRSnapshot): Promise<void> {
    await prisma.mRRSnapshot.create({
      data: {
        id: snap.id,
        tenantId: this.getTenantIdOrThrow(),
        mrr: snap.mrr,
      },
    });
  }
}

export class ARRSnapshotRepository extends BaseTenantRepository {
  async save(snap: ARRSnapshot): Promise<void> {
    await prisma.aRRSnapshot.create({
      data: {
        id: snap.id,
        tenantId: this.getTenantIdOrThrow(),
        arr: snap.arr,
      },
    });
  }
}

export class ChurnMetricRepository extends BaseTenantRepository {
  async save(churn: ChurnMetric): Promise<void> {
    await prisma.churnMetric.create({
      data: {
        id: churn.id,
        tenantId: this.getTenantIdOrThrow(),
        churnRate: churn.churnRate,
      },
    });
  }
}

export class ExpansionRevenueRepository extends BaseTenantRepository {
  async save(exp: ExpansionRevenue): Promise<void> {
    await prisma.expansionRevenue.create({
      data: {
        id: exp.id,
        tenantId: this.getTenantIdOrThrow(),
        amount: exp.amount,
        source: exp.source,
      },
    });
  }
}
