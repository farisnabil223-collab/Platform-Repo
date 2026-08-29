import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  async getSubscriptions(userId: string) {
    return prisma.subscription.findMany({
      where: { userId },
      include: {
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubscriptionById(id: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { invoices: true },
    });
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async cancelSubscription(id: string) {
    await this.getSubscriptionById(id);
    return prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
