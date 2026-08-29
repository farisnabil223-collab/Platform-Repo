import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import { IntegrationConnector, WebhookSubscription, IntegrationWorkflow } from '@eduverse/kernel';

export class IntegrationConnectorRepository extends BaseTenantRepository {
  async save(connector: IntegrationConnector): Promise<void> {
    await prisma.integrationConnector.create({
      data: {
        id: connector.id,
        tenantId: this.getTenantIdOrThrow(),
        name: connector.name,
        version: connector.versionString,
        configJson: connector.configJson,
        status: connector.status,
        healthStatus: connector.healthStatus,
      },
    });
  }

  async findMany(): Promise<IntegrationConnector[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.integrationConnector.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new IntegrationConnector(item.id, {
      tenantId: item.tenantId,
      name: item.name,
      version: item.version,
      configJson: item.configJson,
      status: item.status,
      healthStatus: item.healthStatus,
    }));
  }
}

export class WebhookSubscriptionRepository extends BaseTenantRepository {
  async save(sub: WebhookSubscription): Promise<void> {
    await prisma.webhookSubscription.create({
      data: {
        id: sub.id,
        tenantId: this.getTenantIdOrThrow(),
        targetUrl: sub.targetUrl,
        secret: sub.secret,
        events: sub.events,
        status: sub.status,
      },
    });
  }

  async findMany(): Promise<WebhookSubscription[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.webhookSubscription.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new WebhookSubscription(item.id, {
      tenantId: item.tenantId,
      targetUrl: item.targetUrl,
      secret: item.secret,
      events: item.events,
      status: item.status,
    }));
  }
}

export class IntegrationWorkflowRepository extends BaseTenantRepository {
  async save(workflow: IntegrationWorkflow): Promise<void> {
    await prisma.integrationWorkflow.create({
      data: {
        id: workflow.id,
        tenantId: this.getTenantIdOrThrow(),
        name: workflow.name,
        triggerType: workflow.triggerType,
        configJson: workflow.configJson,
        status: workflow.status,
      },
    });
  }

  async findMany(): Promise<IntegrationWorkflow[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.integrationWorkflow.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new IntegrationWorkflow(item.id, {
      tenantId: item.tenantId,
      name: item.name,
      triggerType: item.triggerType,
      configJson: item.configJson,
      status: item.status,
    }));
  }
}
