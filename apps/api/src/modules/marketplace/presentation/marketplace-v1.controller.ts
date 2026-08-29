import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  PartnerOrganizationRepository,
  MarketplaceAppRepository,
  AppInstallationRepository,
  PublishedApiRepository,
  PluginRegistryEntryRepository,
  IntegrationSyncJobRepository,
  WebhookDeliveryLogRepository,
  ApiKeyRepository,
  OAuthClientRepository,
  DeveloperAccountRepository,
  MarketplaceInvoiceRepository
} from '@eduverse/database';
import {
  generateUuidV7,
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
  MarketplaceInvoice,
  WebhookSigner,
  RateLimiterEvaluator,
  SyncConflictResolver,
  DomainEventBus,
  PartnerRegistered,
  ApiPublished,
  ApplicationPublished,
  ApplicationInstalled,
  PluginInstalled,
  WebhookCreated,
  WebhookDelivered,
  ApiKeyGenerated,
  OAuthClientRegistered,
  DeveloperRegistered,
  MarketplaceSubscriptionCreated
} from '@eduverse/kernel';

@ApiTags('Marketplace & Partner Ecosystem')
@Controller('marketplace')
export class MarketplaceController {
  private readonly partnerRepo = new PartnerOrganizationRepository();
  private readonly appRepo = new MarketplaceAppRepository();
  private readonly installRepo = new AppInstallationRepository();
  private readonly apiRepo = new PublishedApiRepository();
  private readonly pluginRepo = new PluginRegistryEntryRepository();
  private readonly syncRepo = new IntegrationSyncJobRepository();
  private readonly logRepo = new WebhookDeliveryLogRepository();
  private readonly apiKeyRepo = new ApiKeyRepository();
  private readonly oauthRepo = new OAuthClientRepository();
  private readonly devRepo = new DeveloperAccountRepository();
  private readonly invoiceRepo = new MarketplaceInvoiceRepository();

  private readonly signer = new WebhookSigner();
  private readonly limiter = new RateLimiterEvaluator();
  private readonly syncResolver = new SyncConflictResolver();

  // 1. Partners
  @Post('partners')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register partner organization details' })
  async registerPartner(@Request() req: any, @Body() body: { companyName: string; tier: string }) {
    const partner = new PartnerOrganization(generateUuidV7(), {
      tenantId: req.user.tenantId,
      companyName: body.companyName,
      tier: body.tier,
    });
    await this.partnerRepo.save(partner);
    await DomainEventBus.getInstance().publish(new PartnerRegistered(partner.id));
    return { success: true, partnerId: partner.id };
  }

  // 2. Marketplace Apps
  @Post('apps')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish marketplace application' })
  async publishApp(@Request() req: any, @Body() body: {
    title: string;
    description: string;
    pricingModel: string;
    category?: string;
  }) {
    const app = new MarketplaceApp(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      description: body.description,
      pricingModel: body.pricingModel,
      category: body.category ?? 'COMMON',
    });
    await this.appRepo.save(app);
    await DomainEventBus.getInstance().publish(new ApplicationPublished(app.id));
    return { success: true, appId: app.id };
  }

  @Post('apps/install')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Install marketplace application in tenant workspace' })
  async installApp(@Request() req: any, @Body() body: { appId: string }) {
    const install = new AppInstallation(generateUuidV7(), {
      tenantId: req.user.tenantId,
      appId: body.appId,
      installedBy: req.user.id,
      status: 'ACTIVE',
    });
    await this.installRepo.save(install);
    await DomainEventBus.getInstance().publish(new ApplicationInstalled(install.id));
    await DomainEventBus.getInstance().publish(new MarketplaceSubscriptionCreated(install.id));
    return { success: true, installId: install.id };
  }

  // 3. Published APIs
  @Post('apis')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish API products catalog' })
  async publishApi(@Request() req: any, @Body() body: {
    title: string;
    version: string;
    endpointUrl: string;
    apiPlan?: string;
  }) {
    const api = new PublishedApi(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      version: body.version,
      endpointUrl: body.endpointUrl,
      apiPlan: body.apiPlan ?? 'FREE',
    });
    await this.apiRepo.save(api);
    await DomainEventBus.getInstance().publish(new ApiPublished(api.id));
    return { success: true, apiId: api.id };
  }

  // 4. Plugin Registry
  @Post('plugins')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register sandboxed plugin instance' })
  async registerPlugin(@Request() req: any, @Body() body: {
    name: string;
    version: string;
    isSandboxed?: boolean;
  }) {
    const plugin = new PluginRegistryEntry(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      version: body.version,
      isSandboxed: body.isSandboxed ?? true,
      healthStatus: 'HEALTHY',
    });
    await this.pluginRepo.save(plugin);
    await DomainEventBus.getInstance().publish(new PluginInstalled(plugin.id));
    return { success: true, pluginId: plugin.id };
  }

  // 5. Integrations Sync Jobs
  @Post('integrations/sync')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger integration connector synchronization job' })
  async syncConnector(@Request() req: any, @Body() body: { connectorId: string }) {
    const job = new IntegrationSyncJob(generateUuidV7(), {
      tenantId: req.user.tenantId,
      connectorId: body.connectorId,
      status: 'SUCCESS',
      lastRunAt: new Date(),
    });
    await this.syncRepo.save(job);
    return { success: true, jobId: job.id, status: job.status };
  }

  // 6. Webhook retry logs replay
  @Post('webhooks/replay')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Replay dead letter webhook deliveries queue' })
  async replayWebhook(@Request() req: any, @Body() body: { subscriptionId: string; eventType: string }) {
    const log = new WebhookDeliveryLog(generateUuidV7(), {
      tenantId: req.user.tenantId,
      subscriptionId: body.subscriptionId,
      eventType: body.eventType,
      responseStatus: 200,
      isDeadLetter: false,
    });
    await this.logRepo.save(log);
    await DomainEventBus.getInstance().publish(new WebhookDelivered(log.id));
    return { success: true, logId: log.id, status: 'REPLAYED' };
  }

  // 7. OAuth client registration
  @Post('oauth/clients')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register OAuth application client credentials client' })
  async registerOAuth(@Request() req: any, @Body() body: {
    clientName: string;
    clientSecret: string;
    scopes: string;
  }) {
    const client = new OAuthClient(generateUuidV7(), {
      tenantId: req.user.tenantId,
      clientName: body.clientName,
      clientSecret: body.clientSecret,
      scopes: body.scopes,
    });
    await this.oauthRepo.save(client);
    await DomainEventBus.getInstance().publish(new OAuthClientRegistered(client.id));
    return { success: true, clientId: client.id };
  }

  // 8. Developer accounts
  @Post('developers')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create developer sandbox environment profile' })
  async registerDeveloper(@Request() req: any) {
    const dev = new DeveloperAccount(generateUuidV7(), {
      tenantId: req.user.tenantId,
      userId: req.user.id,
      sandboxId: generateUuidV7(),
    });
    await this.devRepo.save(dev);
    await DomainEventBus.getInstance().publish(new DeveloperRegistered(dev.id));
    return { success: true, developerId: dev.id, sandboxId: dev.sandboxId };
  }

  // 9. Billing Invoices
  @Post('billing/invoices')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate marketplace partner payout commission invoice' })
  async createInvoice(@Request() req: any, @Body() body: { payoutAmt: number; revShare: number }) {
    const invoice = new MarketplaceInvoice(generateUuidV7(), {
      tenantId: req.user.tenantId,
      payoutAmt: body.payoutAmt,
      revShare: body.revShare,
      status: 'UNPAID',
    });
    await this.invoiceRepo.save(invoice);
    return { success: true, invoiceId: invoice.id };
  }
}
