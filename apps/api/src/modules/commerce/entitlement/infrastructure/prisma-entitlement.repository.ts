import { Injectable } from '@nestjs/common';
import { IEntitlementRepository } from '../domain/entitlement.repository.interface';
import { prisma } from '@eduverse/database';
import { EntitlementStatus } from '@prisma/client';

@Injectable()
export class PrismaEntitlementRepository implements IEntitlementRepository {
  async findMany(params: { ownerId: string; page: number; limit: number }): Promise<{ items: any[]; total: number }> {
    const { ownerId, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = { ownerId };
    const [items, total] = await Promise.all([
      prisma.entitlement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { grantedAt: 'desc' },
      }),
      prisma.entitlement.count({ where }),
    ]);

    return { items, total };
  }

  async findActiveByOwnerAndProduct(ownerId: string, productId: string): Promise<any | null> {
    return prisma.entitlement.findFirst({
      where: {
        ownerId,
        productId,
        status: 'ACTIVE',
      },
    });
  }

  async create(data: any): Promise<any> {
    return prisma.entitlement.create({
      data,
    });
  }

  async updateStatus(id: string, status: string): Promise<any> {
    return prisma.entitlement.update({
      where: { id },
      data: { status: status as EntitlementStatus },
    });
  }
}
