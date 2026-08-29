import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  PartnerOrganization,
  MarketplaceApp,
  AppInstallation,
  PublishedApi,
  PluginRegistryEntry,
  IntegrationSyncJob,
  WebhookDeliveryLog,
  ApiKey,
  OAuthClient,
  DeveloperAccount,
  MarketplaceInvoice
} from '@eduverse/kernel';

export class PartnerOrganizationRepository extends BaseTenantRepository {
  async save(partner: PartnerOrganization): Promise<void> {
    await prisma.partnerOrganization.upsert({
      where: { id: partner.id },
      update: { tier: partner.tier, certificationDate: partner.certificationDate },
      create: {
        id: partner.id,
        tenantId: this.getTenantIdOrThrow(),
        companyName: partner.companyName,
        tier: partner.tier,
        certificationDate: partner.certificationDate,
      },
    });
  }
}

export class MarketplaceAppRepository extends BaseTenantRepository {
  async save(app: MarketplaceApp): Promise<void> {
    await prisma.marketplaceApp.upsert({
      where: { id: app.id },
      update: { description: app.description, category: app.category },
      create: {
        id: app.id,
        tenantId: this.getTenantIdOrThrow(),
        title: app.title,
        description: app.description,
        pricingModel: app.pricingModel,
        category: app.category,
      },
    });
  }
}

export class AppInstallationRepository extends BaseTenantRepository {
  async save(install: AppInstallation): Promise<void> {
    await prisma.appInstallation.upsert({
      where: { id: install.id },
      update: { status: install.status },
      create: {
        id: install.id,
        tenantId: this.getTenantIdOrThrow(),
        appId: install.appId,
        installedBy: install.installedBy,
        status: install.status,
      },
    });
  }
}

export class PublishedApiRepository extends BaseTenantRepository {
  async save(api: PublishedApi): Promise<void> {
    await prisma.publishedApi.upsert({
      where: { id: api.id },
      update: { version: api.versionString, apiPlan: api.apiPlan },
      create: {
        id: api.id,
        tenantId: this.getTenantIdOrThrow(),
        title: api.title,
        version: api.versionString,
        endpointUrl: api.endpointUrl,
        apiPlan: api.apiPlan,
      },
    });
  }
}

export class PluginRegistryEntryRepository extends BaseTenantRepository {
  async save(plugin: PluginRegistryEntry): Promise<void> {
    await prisma.pluginRegistry.upsert({
      where: { id: plugin.id },
      update: { healthStatus: plugin.healthStatus },
      create: {
        id: plugin.id,
        tenantId: this.getTenantIdOrThrow(),
        name: plugin.name,
        version: plugin.versionString,
        isSandboxed: plugin.isSandboxed,
        healthStatus: plugin.healthStatus,
      },
    });
  }
}

export class IntegrationSyncJobRepository extends BaseTenantRepository {
  async save(job: IntegrationSyncJob): Promise<void> {
    await prisma.integrationSyncJob.upsert({
      where: { id: job.id },
      update: { status: job.status, lastRunAt: job.lastRunAt },
      create: {
        id: job.id,
        tenantId: this.getTenantIdOrThrow(),
        connectorId: job.connectorId,
        status: job.status,
        lastRunAt: job.lastRunAt,
      },
    });
  }
}

export class WebhookDeliveryLogRepository extends BaseTenantRepository {
  async save(log: WebhookDeliveryLog): Promise<void> {
    await prisma.webhookDeliveryLog.create({
      data: {
        id: log.id,
        tenantId: this.getTenantIdOrThrow(),
        subscriptionId: log.subscriptionId,
        eventType: log.eventType,
        responseStatus: log.responseStatus,
        isDeadLetter: log.isDeadLetter,
      },
    });
  }
}

export class ApiKeyRepository extends BaseTenantRepository {
  async save(key: ApiKey): Promise<void> {
    await prisma.apiKey.upsert({
      where: { id: key.id },
      update: { rateLimit: key.rateLimit },
      create: {
        id: key.id,
        tenantId: this.getTenantIdOrThrow(),
        keyHash: key.keyHash,
        rateLimit: key.rateLimit,
      },
    });
  }

  async findByKeyHash(keyHash: string): Promise<ApiKey | null> {
    const row = await prisma.apiKey.findFirst({
      where: { keyHash, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new ApiKey(row.id, {
      tenantId: row.tenantId,
      keyHash: row.keyHash,
      rateLimit: row.rateLimit,
    });
  }
}

export class OAuthClientRepository extends BaseTenantRepository {
  async save(client: OAuthClient): Promise<void> {
    await prisma.oAuthClient.upsert({
      where: { id: client.id },
      update: { clientSecret: client.clientSecret, scopes: client.scopes },
      create: {
        id: client.id,
        tenantId: this.getTenantIdOrThrow(),
        clientName: client.clientName,
        clientSecret: client.clientSecret,
        scopes: client.scopes,
      },
    });
  }
}

export class DeveloperAccountRepository extends BaseTenantRepository {
  async save(dev: DeveloperAccount): Promise<void> {
    await prisma.developerAccount.upsert({
      where: { id: dev.id },
      update: { sandboxId: dev.sandboxId },
      create: {
        id: dev.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: dev.userId,
        sandboxId: dev.sandboxId,
      },
    });
  }
}

export class MarketplaceInvoiceRepository extends BaseTenantRepository {
  async save(invoice: MarketplaceInvoice): Promise<void> {
    await prisma.marketplaceInvoice.upsert({
      where: { id: invoice.id },
      update: { status: invoice.status },
      create: {
        id: invoice.id,
        tenantId: this.getTenantIdOrThrow(),
        payoutAmt: invoice.payoutAmt,
        revShare: invoice.revShare,
        status: invoice.status,
      },
    });
  }
}
