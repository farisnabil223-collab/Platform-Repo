import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class OrganizationProvisioningEngine {
  async provision(name: string, type: string, ownerEmail: string) {
    const tenantId = generateUuidV7();
    const orgId = generateUuidV7();
    const billingAccountId = generateUuidV7();

    return prisma.$transaction(async (tx) => {
      // 1. Create Tenant context
      await tx.tenant.create({
        data: {
          id: tenantId,
          name,
          status: 'ACTIVE',
        },
      });

      // 2. Create Organization
      const org = await tx.organization.create({
        data: {
          id: orgId,
          tenantId,
          name,
          type,
          status: 'PROVISIONING',
        },
      });

      // 3. Create Billing Account
      await tx.billingAccount.create({
        data: {
          id: billingAccountId,
          tenantId,
          companyName: name,
          email: ownerEmail,
          status: 'ACTIVE',
        },
      });

      // 4. Create default Branding
      await tx.organizationBranding.create({
        data: {
          id: generateUuidV7(),
          organizationId: orgId,
          primaryColor: '#1E293B',
          secondaryColor: '#0F172A',
        },
      });

      // 5. Create default Settings & Policies
      await tx.organizationSettings.create({
        data: {
          id: generateUuidV7(),
          organizationId: orgId,
          timezone: 'UTC',
          language: 'en',
          currency: 'USD',
        },
      });

      await tx.organizationSecurityPolicy.create({
        data: {
          id: generateUuidV7(),
          organizationId: orgId,
          allowedDomains: [ownerEmail.split('@')[1]],
        },
      });

      // 6. Set status to ACTIVE (Complete)
      return tx.organization.update({
        where: { id: orgId },
        data: { status: 'ACTIVE' },
      });
    });
  }
}
