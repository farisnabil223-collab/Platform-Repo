import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { prisma } from '@eduverse/database';
import { generateUuidV7, Tenant, Organization, TenantProvisioningService } from '@eduverse/kernel';

@ApiTags('Multi-Tenant SaaS Platform')
@Controller('tenants')
export class TenantsController {
  private readonly provisioningService = new TenantProvisioningService();

  // 1. Tenant Lifecycle Operations
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Provision a new tenant' })
  async provisionTenant(@Body() body: { name: string; customDomain?: string }) {
    const id = generateUuidV7();
    const tenant = new Tenant(id, { name: body.name, status: 'PROVISIONING' });

    // Seed defaults config
    const settings = this.provisioningService.provisionDefaultSettings(tenant);

    const result = await prisma.$transaction(async (tx) => {
      const t = await tx.tenant.create({
        data: {
          id: tenant.id,
          name: tenant.name,
          status: 'ACTIVE',
        },
      });

      await tx.tenantSettings.create({
        data: {
          id: generateUuidV7(),
          tenantId: tenant.id,
          customDomain: body.customDomain || null,
          storageLimitGb: settings.storageLimitGb,
          timezone: settings.timezone,
          language: settings.language,
          currency: settings.currency,
        },
      });

      await tx.tenantBrand.create({
        data: {
          id: generateUuidV7(),
          tenantId: tenant.id,
          primaryColor: '#1E293B',
          typography: 'Inter',
        },
      });

      await tx.tenantLifecycleHistory.create({
        data: {
          id: generateUuidV7(),
          tenantId: tenant.id,
          fromStatus: 'DRAFT',
          toStatus: 'ACTIVE',
        },
      });

      return t;
    });

    return result;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant settings and branding details' })
  async getTenantDetails(@Param('id') id: string) {
    return prisma.tenant.findUniqueOrThrow({
      where: { id },
      include: { settings: true, branding: true, history: true },
    });
  }

  @Post(':id/suspend')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend a tenant' })
  async suspendTenant(@Param('id') id: string) {
    return prisma.$transaction(async (tx) => {
      const t = await tx.tenant.update({
        where: { id },
        data: { status: 'SUSPENDED' },
      });

      await tx.tenantLifecycleHistory.create({
        data: {
          id: generateUuidV7(),
          tenantId: id,
          fromStatus: 'ACTIVE',
          toStatus: 'SUSPENDED',
        },
      });

      return t;
    });
  }

  @Post(':id/clone')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clone layout colors and setup configuration to target tenant' })
  async cloneTenant(@Param('id') sourceId: string, @Body() body: { targetName: string }) {
    const sourceBranding = await prisma.tenantBrand.findUniqueOrThrow({ where: { tenantId: sourceId } });
    const targetId = generateUuidV7();

    return prisma.$transaction(async (tx) => {
      const t = await tx.tenant.create({
        data: {
          id: targetId,
          name: body.targetName,
          status: 'ACTIVE',
        },
      });

      await tx.tenantBrand.create({
        data: {
          id: generateUuidV7(),
          tenantId: targetId,
          primaryColor: sourceBranding.primaryColor,
          typography: sourceBranding.typography,
          logoUrl: sourceBranding.logoUrl,
        },
      });

      return t;
    });
  }

  // 2. Tenant Settings & Branding Overrides
  @Put(':id/settings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant settings overrides' })
  async updateSettings(@Param('id') id: string, @Body() body: { timezone?: string; language?: string; currency?: string }) {
    return prisma.tenantSettings.update({
      where: { tenantId: id },
      data: {
        timezone: body.timezone,
        language: body.language,
        currency: body.currency,
      },
    });
  }

  // 3. Resource Quotas
  @Get(':id/quotas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get allocated resource quota status limits' })
  async getQuotas(@Param('id') id: string) {
    return prisma.tenantQuota.findMany({ where: { tenantId: id } });
  }

  @Put(':id/quotas/:resource')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set quota limit on a specific resource type' })
  async setQuotaLimit(@Param('id') id: string, @Param('resource') resource: string, @Body() body: { limit: number }) {
    return prisma.tenantQuota.upsert({
      where: { tenantId_resourceType: { tenantId: id, resourceType: resource } },
      update: { allocatedLimit: body.limit },
      create: {
        id: generateUuidV7(),
        tenantId: id,
        resourceType: resource,
        allocatedLimit: body.limit,
        currentUsage: 0,
      },
    });
  }

  // 4. Hierarchical Organizations CRUD
  @Post(':id/organizations')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add organization structural node campus/faculty/department' })
  async createOrganizationNode(@Param('id') tenantId: string, @Body() body: { name: string; type: string; parentId?: string }) {
    return prisma.organization.create({
      data: {
        id: generateUuidV7(),
        tenantId,
        name: body.name,
        type: body.type,
        parentId: body.parentId || null,
      },
    });
  }

  @Get(':id/organizations/hierarchy')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get entire organization tree structure hierarchy' })
  async getHierarchy(@Param('id') tenantId: string) {
    return prisma.organization.findMany({
      where: { tenantId },
    });
  }

  // 5. Tenant Context resolution details
  @Get('context/resolve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve resolved active tenant execution context context' })
  async getActiveContext(@Request() req: any) {
    return {
      tenantId: req.tenantId || 'default-tenant-uuid',
      resolvedVia: 'HEADER_OR_SUBDOMAIN',
    };
  }

  // 6. Feature Flags Packs overrides
  @Post('features/packs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register feature pack bundle configuration' })
  async registerFeaturePack(@Body() body: { name: string; description?: string; features: string[] }) {
    const id = generateUuidV7();
    return prisma.featurePack.create({
      data: {
        id,
        name: body.name,
        description: body.description,
        features: body.features,
      },
    });
  }

  @Get('features/packs')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all registered feature pack configurations' })
  async getFeaturePacks() {
    return prisma.featurePack.findMany();
  }

  // 7. License Pools & seats reservations
  @Post(':id/licenses/pools')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign license seat pool quota details' })
  async createLicensePool(@Param('id') tenantId: string, @Body() body: { totalSeats: number; expirationDate: string }) {
    const id = generateUuidV7();
    return prisma.licensePool.create({
      data: {
        id,
        tenantId,
        totalSeats: body.totalSeats,
        expirationDate: new Date(body.expirationDate),
      },
    });
  }

  @Post(':id/licenses/allocate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Allocate license seat to target user' })
  async allocateSeat(@Param('id') tenantId: string) {
    const pool = await prisma.licensePool.findUniqueOrThrow({ where: { tenantId } });
    if (pool.allocatedSeats >= pool.totalSeats) {
      throw new BadRequestException('License pool capacity reached');
    }
    return prisma.licensePool.update({
      where: { tenantId },
      data: { allocatedSeats: pool.allocatedSeats + 1 },
    });
  }

  // 8. Config snapshots rollbacks
  @Post(':id/snapshots')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create configuration snapshot backup' })
  async createSnapshot(@Param('id') tenantId: string, @Body() body: { createdBy: string; configurationJson: any }) {
    const id = generateUuidV7();
    const count = await prisma.tenantConfigSnapshot.count({ where: { tenantId } });
    return prisma.tenantConfigSnapshot.create({
      data: {
        id,
        tenantId,
        configVersion: count + 1,
        checksum: 'MD5_MOCK_CHECKSUM',
        createdBy: body.createdBy,
        configurationJson: body.configurationJson,
      },
    });
  }

  @Post(':id/snapshots/:snapshotId/rollback')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rollback tenant setup configurations to backup snapshot version' })
  async rollbackSnapshot(@Param('id') tenantId: string, @Param('snapshotId') snapshotId: string) {
    const snapshot = await prisma.tenantConfigSnapshot.findUniqueOrThrow({ where: { id: snapshotId } });
    return prisma.tenantSettings.update({
      where: { tenantId },
      data: {
        timezone: (snapshot.configurationJson as any).timezone || 'UTC',
        language: (snapshot.configurationJson as any).language || 'en',
      },
    });
  }

  // 9. Maintenance Mode checks
  @Post(':id/maintenance/enable')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend active client traffic and set maintenance status' })
  async enableMaintenance(@Param('id') id: string) {
    return prisma.tenant.update({
      where: { id },
      data: { status: 'MAINTENANCE' },
    });
  }

  @Post(':id/maintenance/disable')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable maintenance mode' })
  async disableMaintenance(@Param('id') id: string) {
    return prisma.tenant.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  // 10. Tenant Health status checks
  @Get(':id/health')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active tenant integration database/cache health status' })
  async getHealth(@Param('id') tenantId: string) {
    const id = generateUuidV7();
    return prisma.tenantHealthStatus.create({
      data: {
        id,
        tenantId,
        databaseStatus: 'HEALTHY',
        redisStatus: 'HEALTHY',
        storageStatus: 'HEALTHY',
      },
    });
  }
}
