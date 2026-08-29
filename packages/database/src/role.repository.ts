import { IRoleRepository, Role } from '@eduverse/kernel';
import { PrismaBaseRepository } from './prisma-repository';
import { PrismaClient, Role as PrismaRole } from '@prisma/client';

export class RoleRepository extends PrismaBaseRepository<Role, PrismaRole> implements IRoleRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.role);
  }

  toDomain(record: PrismaRole & { rolePermissions?: any[] }): Role {
    const permissionIds = record.rolePermissions
      ? record.rolePermissions.map((rp: any) => rp.permissionId)
      : [];
    return new Role(
      record.id,
      {
        name: record.name,
        description: record.description,
        permissionIds,
      },
      record.version,
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(domain: Role): PrismaRole {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      version: domain.version,
    };
  }

  async findByName(name: string): Promise<Role | null> {
    const record = await this.prismaClient.role.findFirst({
      where: { name: name.toUpperCase() },
      include: { rolePermissions: true },
    });
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<Role | null> {
    const record = await this.prismaClient.role.findUnique({
      where: { id },
      include: { rolePermissions: true },
    });
    return record ? this.toDomain(record) : null;
  }

  async save(entity: Role): Promise<void> {
    const data = this.toPersistence(entity);
    await this.prismaClient.role.upsert({
      where: { id: entity.id },
      update: {
        name: data.name,
        description: data.description,
        version: { increment: 1 },
      },
      create: data,
    });

    // Sync role permissions list in the join table
    if (entity.permissionIds.length > 0) {
      // Clear existing first
      await this.prismaClient.rolePermission.deleteMany({
        where: { roleId: entity.id },
      });
      // Create new join mappings
      const createInputs = entity.permissionIds.map((pId) => ({
        roleId: entity.id,
        permissionId: pId,
      }));
      await this.prismaClient.rolePermission.createMany({
        data: createInputs,
      });
    }
  }
}
