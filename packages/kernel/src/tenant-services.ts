import { Tenant } from './tenant-aggregates';

export class TenantProvisioningService {
  provisionDefaultSettings(tenant: Tenant): any {
    return {
      tenantId: tenant.id,
      timezone: 'UTC',
      language: 'en',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
      storageLimitGb: 10,
    };
  }

  cloneTenantConfig(sourceTenantId: string, targetTenant: Tenant, sourceBranding: any): any {
    return {
      tenantId: targetTenant.id,
      logoUrl: sourceBranding.logoUrl,
      primaryColor: sourceBranding.primaryColor,
      typography: sourceBranding.typography,
      clonedFrom: sourceTenantId,
    };
  }
}
