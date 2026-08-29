import { TenantContextAccessor } from '@eduverse/kernel';

export class BaseTenantRepository {
  protected getTenantIdOrThrow(): string {
    const tenantId = TenantContextAccessor.getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context isolation breach: No active TenantId resolved in current execution scope');
    }
    return tenantId;
  }

  protected applyTenantFilter(whereClause: any = {}): any {
    const tenantId = this.getTenantIdOrThrow();
    return {
      ...whereClause,
      tenantId,
    };
  }
}
