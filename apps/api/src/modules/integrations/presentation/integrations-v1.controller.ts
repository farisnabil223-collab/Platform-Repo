import { Body, Controller, Get, Param, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { prisma, IntegrationConnectorRepository, WebhookSubscriptionRepository, IntegrationWorkflowRepository } from '@eduverse/database';
import { generateUuidV7, IntegrationConnector, WebhookSubscription, IntegrationWorkflow, WebhookProtection, IntegrationSchemaValidator } from '@eduverse/kernel';

@ApiTags('Enterprise Integration Platform')
@Controller('integrations')
export class IntegrationsController {
  private readonly connectorRepo = new IntegrationConnectorRepository();
  private readonly webhookRepo = new WebhookSubscriptionRepository();
  private readonly workflowRepo = new IntegrationWorkflowRepository();
  private readonly webhookProtection = new WebhookProtection();
  private readonly schemaValidator = new IntegrationSchemaValidator();

  // 1. Third-Party Connector Installation
  @Post('connectors')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register/Install third-party connector configuration settings' })
  async installConnector(@Body() body: {
    tenantId: string;
    name: string;
    version: string;
    configJson: any;
  }) {
    const connector = new IntegrationConnector(generateUuidV7(), {
      tenantId: body.tenantId,
      name: body.name,
      version: body.version,
      configJson: body.configJson,
      status: 'ACTIVE',
      healthStatus: 'HEALTHY',
    });
    await this.connectorRepo.save(connector);
    return { success: true, connectorId: connector.id };
  }

  // 2. Webhook Registration
  @Post('webhooks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register webhook event subscriber URL' })
  async registerWebhook(@Body() body: {
    tenantId: string;
    targetUrl: string;
    secret: string;
    events: string;
  }) {
    const sub = new WebhookSubscription(generateUuidV7(), {
      tenantId: body.tenantId,
      targetUrl: body.targetUrl,
      secret: body.secret,
      events: body.events,
      status: 'ACTIVE',
    });
    await this.webhookRepo.save(sub);
    return { success: true, subscriptionId: sub.id, signatureSecret: sub.secret };
  }

  // 3. Webhook Delivery & Signature Validation
  @Post('webhooks/verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify signature and replay window validity of webhook' })
  async verifyWebhook(@Body() body: {
    payload: string;
    signature: string;
    secret: string;
    timestampHeader: string;
  }) {
    const isSigValid = this.webhookProtection.verifySignature(body.payload, body.signature, body.secret);
    const isTimeValid = this.webhookProtection.isTimestampValid(body.timestampHeader);

    if (!isSigValid) {
      throw new BadRequestException('Security validation failure: Invalid signature match');
    }
    if (!isTimeValid) {
      throw new BadRequestException('Security replay threat: Timestamp headers falls outside window bounds');
    }
    return { verified: true };
  }

  // 4. Workflow builder workflows
  @Post('workflows')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create automated workflow triggers' })
  async createWorkflow(@Body() body: {
    tenantId: string;
    name: string;
    triggerType: string;
    configJson: any;
  }) {
    const workflow = new IntegrationWorkflow(generateUuidV7(), {
      tenantId: body.tenantId,
      name: body.name,
      triggerType: body.triggerType,
      configJson: body.configJson,
      status: 'ACTIVE',
    });
    await this.workflowRepo.save(workflow);
    return { success: true, workflowId: workflow.id };
  }

  // 5. Schema Registry Version Validation
  @Post('schemas')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate schema registry payload structures matching topic configuration' })
  async validateSchema(@Body() body: {
    payload: any;
    schemaJson: any;
  }) {
    const valid = this.schemaValidator.validatePayload(body.payload, body.schemaJson);
    if (!valid) {
      throw new BadRequestException('Schema validation breach: payload missing required properties');
    }
    return { valid: true };
  }
}
