import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { Decimal } from '@eduverse/shared-domain';

@Injectable()
export class BundleService {
  async getBundles(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.bundle.findMany({
        include: {
          courses: {
            include: { course: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bundle.count(),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBundleById(id: string) {
    const bundle = await prisma.bundle.findUnique({
      where: { id },
      include: {
        courses: {
          include: { course: true },
        },
      },
    });
    if (!bundle) throw new NotFoundException('Bundle not found');
    return bundle;
  }

  async createBundle(data: { name: string; slug: string; description?: string; price: number; courseIds: string[] }) {
    const id = generateUuidV7();
    const bundle = await prisma.bundle.create({
      data: {
        id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: new Decimal(data.price),
        courses: {
          create: data.courseIds.map((courseId) => ({
            courseId,
          })),
        },
      },
      include: {
        courses: true,
      },
    });

    // Mirror to Product model
    await prisma.product.create({
      data: {
        id: generateUuidV7(),
        slug: data.slug,
        title: data.name,
        description: data.description || '',
        price: new Decimal(data.price),
        type: 'BUNDLE',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        targetType: 'BUNDLE',
        targetId: id,
        searchTitle: data.name,
        seoSlug: data.slug,
      },
    });

    return bundle;
  }

  async deleteBundle(id: string) {
    const bundle = await this.getBundleById(id);
    await prisma.bundle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    // Remove from products
    await prisma.product.updateMany({
      where: { targetId: id, targetType: 'BUNDLE' },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }
}
