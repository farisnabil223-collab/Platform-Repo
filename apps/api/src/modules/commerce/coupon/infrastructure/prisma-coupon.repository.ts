import { Injectable } from '@nestjs/common';
import { ICouponRepository } from '../domain/coupon.repository.interface';
import { prisma } from '@eduverse/database';

@Injectable()
export class PrismaCouponRepository implements ICouponRepository {
  async findById(id: string): Promise<any | null> {
    return prisma.coupon.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<any | null> {
    return prisma.coupon.findUnique({
      where: { code },
    });
  }

  async findMany(params: { page: number; limit: number }): Promise<{ items: any[]; total: number }> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };
    const [items, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.coupon.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: any): Promise<any> {
    return prisma.coupon.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<any> {
    return prisma.coupon.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<any> {
    return prisma.coupon.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
