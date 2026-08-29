import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../domain/product.repository.interface';
import { prisma } from '@eduverse/database';
import { ProductWorkflowStatus, ProductVisibility } from '@prisma/client';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  async findById(id: string): Promise<any | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<any | null> {
    return prisma.product.findUnique({
      where: { slug },
    });
  }

  async findMany(params: {
    type?: string;
    status?: ProductWorkflowStatus;
    visibility?: ProductVisibility;
    page: number;
    limit: number;
    search?: string;
    sort?: string;
  }): Promise<{ items: any[]; total: number }> {
    const { type, status, visibility, page, limit, search, sort } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (type) where.type = type;
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { searchTitle: { contains: search, mode: 'insensitive' } },
        { searchDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: any): Promise<any> {
    return prisma.product.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<any> {
    if (data.version !== undefined && data.version > 1) {
      const current = await prisma.product.findUnique({ where: { id } });
      if (current && current.version >= data.version) {
        throw new Error('Conflict: Product has been modified by another process.');
      }
    }
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<any> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createPriceHistory(data: any): Promise<any> {
    return prisma.productPriceHistory.create({
      data,
    });
  }

  async getPriceHistory(productId: string): Promise<any[]> {
    return prisma.productPriceHistory.findMany({
      where: { productId },
      orderBy: { changedAt: 'desc' },
    });
  }
}
