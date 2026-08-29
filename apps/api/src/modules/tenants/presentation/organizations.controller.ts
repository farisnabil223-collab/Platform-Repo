import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { OrganizationProvisioningEngine } from '../application/organization-provisioning.engine';
import { OrganizationLifecycleService } from '../application/organization-lifecycle.service';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class ProvisionOrgDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string; // SCHOOL, UNIVERSITY, ACADEMY

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerEmail!: string;
}

class TransitionLifecycleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status!: string;
}

class ConfigureBrandingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  primaryColor!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secondaryColor!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;
}

class RegisterDomainDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  domain!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subdomain!: string;
}

@ApiTags('Multi-Tenant Organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly provisioningEngine: OrganizationProvisioningEngine,
    private readonly lifecycleService: OrganizationLifecycleService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Provision a new organization' })
  async provisionOrganization(@Body() dto: ProvisionOrgDto) {
    const org = await this.provisioningEngine.provision(dto.name, dto.type, dto.ownerEmail);
    return { success: true, data: org };
  }

  @Post(':id/lifecycle')
  @ApiOperation({ summary: 'Transition organization status' })
  async transitionLifecycle(@Param('id') id: string, @Body() dto: TransitionLifecycleDto) {
    const updated = await this.lifecycleService.transitionStatus(id, dto.status);
    return { success: true, data: updated };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get organization settings' })
  async getSettings(@Query('organizationId') orgId: string) {
    const settings = await prisma.organizationSettings.findMany({
      where: { organizationId: orgId },
    });
    return { success: true, data: settings };
  }

  @Post('branding')
  @ApiOperation({ summary: 'Configure branding assets' })
  async configureBranding(@Query('organizationId') orgId: string, @Body() dto: ConfigureBrandingDto) {
    const branding = await prisma.organizationBranding.create({
      data: {
        id: generateUuidV7(),
        organizationId: orgId,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
        logo: dto.logo,
      },
    });
    return { success: true, data: branding };
  }

  @Post('domains')
  @ApiOperation({ summary: 'Register custom domain mappings' })
  async registerDomain(@Query('organizationId') orgId: string, @Body() dto: RegisterDomainDto) {
    const domain = await prisma.organizationDomain.create({
      data: {
        id: generateUuidV7(),
        organizationId: orgId,
        domain: dto.domain,
        subdomain: dto.subdomain,
        verificationToken: 'v-tok-' + Math.random().toString(36).substring(2, 8),
        verificationMethod: 'TXT',
      },
    });
    return { success: true, data: domain };
  }

  @Get('billing')
  @ApiOperation({ summary: 'List invoicing billing logs' })
  async getBillingLogs(@Query('organizationId') orgId: string) {
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
    });

    const accounts = await prisma.billingAccount.findMany({
      where: { tenantId: org.tenantId },
      include: { OrganizationInvoice: true },
    });
    return { success: true, data: accounts };
  }
}
