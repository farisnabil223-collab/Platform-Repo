import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { CacheService } from '@eduverse/cache';
import { AssignPermissionDto } from '../../dto/assign.dto';

@Injectable()
export class AssignPermissionHandler {
  constructor(private readonly cacheService: CacheService) {}

  async execute(dto: AssignPermissionDto): Promise<void> {
    const role = await prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const permission = await prisma.permission.findUnique({ where: { id: dto.permissionId } });
    if (!permission) {
      throw new BadRequestException('Permission not found');
    }

    // Check if permission is already assigned to this role
    const existing = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: { roleId: dto.roleId, permissionId: dto.permissionId },
      },
    });

    if (existing) {
      return;
    }

    await prisma.rolePermission.create({
      data: {
        roleId: dto.roleId,
        permissionId: dto.permissionId,
      },
    });

    // Invalidate Redis permissions cache for all users holding this role
    const usersWithRole = await prisma.userRole.findMany({
      where: { roleId: dto.roleId },
      select: { userId: true },
    });

    const redis = this.cacheService.getClient();
    const batch = redis.pipeline();
    for (const u of usersWithRole) {
      batch.del(`user:permissions:${u.userId}`);
    }
    await batch.exec().catch(() => {});
  }
}
