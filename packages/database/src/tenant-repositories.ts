import { Tenant, Organization } from '@eduverse/kernel';
import { prisma } from './index';

export class TenantRepository {
  async findById(id: string): Promise<Tenant | null> {
    const row = await prisma.tenant.findUnique({ where: { id } });
    if (!row) return null;
    return new Tenant(row.id, {
      name: row.name,
      status: row.status,
    }, 1, row.createdAt, row.createdAt);
  }

  async save(entity: Tenant): Promise<void> {
    await prisma.tenant.upsert({
      where: { id: entity.id },
      update: {
        name: entity.name,
        status: entity.status,
      },
      create: {
        id: entity.id,
        name: entity.name,
        status: entity.status,
      },
    });
  }
}

export class OrganizationRepository {
  async save(entity: Organization): Promise<void> {
    await prisma.organization.upsert({
      where: { id: entity.id },
      update: {
        name: entity.name,
        parentId: entity.parentId || null,
      },
      create: {
        id: entity.id,
        tenantId: entity.tenantId,
        name: entity.name,
        type: entity.type,
        parentId: entity.parentId || null,
      },
    });
  }
}
