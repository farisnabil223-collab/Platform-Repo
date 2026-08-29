import { Injectable } from '@nestjs/common';
import { ICartRepository } from '../domain/cart.repository.interface';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<any | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async create(userId: string, expiresAt: Date): Promise<any> {
    return prisma.cart.create({
      data: {
        id: generateUuidV7(),
        userId,
        expiresAt,
      },
      include: {
        items: true,
      },
    });
  }

  async update(userId: string, data: any, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.cart.update({
      where: { userId },
      data: {
        ...data,
        lastActivity: new Date(),
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async clear(userId: string, tx?: any): Promise<any> {
    const client = tx || prisma;
    const cart = await this.findByUserId(userId);
    if (!cart) return null;

    // Clear cart items
    await client.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return client.cart.update({
      where: { userId },
      data: {
        lastActivity: new Date(),
      },
      include: {
        items: true,
      },
    });
  }
}
