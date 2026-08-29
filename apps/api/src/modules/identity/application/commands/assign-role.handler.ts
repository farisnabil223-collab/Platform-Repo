import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { CacheService } from '@eduverse/cache';
import { AssignRoleDto } from '../../dto/assign.dto';

@Injectable()
export class AssignRoleHandler {
  constructor(private readonly cacheService: CacheService) {}

  async execute(dto: AssignRoleDto): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const role = await prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    // Check if user already has this role
    const existing = await prisma.userRole.findUnique({
      where: {
        userId_roleId: { userId: dto.userId, roleId: dto.roleId },
      },
    });

    if (existing) {
      return;
    }

    await prisma.userRole.create({
      data: {
        userId: dto.userId,
        roleId: dto.roleId,
      },
    });

    // Invalidate Redis permissions cache for user
    const redis = this.cacheService.getClient();
    const cacheKey = `user:permissions:${dto.userId}`;
    await redis.del(cacheKey).catch(() => {});
  }
}
