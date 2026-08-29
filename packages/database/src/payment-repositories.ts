import { Payment, Invoice, Subscription, UserWallet, Coupon, PaymentIntent, PaymentMethod, Account, JournalEntry } from '@eduverse/kernel';
import { prisma } from './index';

export class PaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    const row = await prisma.payment.findUnique({ where: { id } });
    if (!row) return null;
    return new Payment(row.id, {
      userId: row.userId,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      referenceId: row.referenceId || undefined,
    }, row.version, row.createdAt, row.updatedAt);
  }

  async save(entity: Payment): Promise<void> {
    await prisma.payment.upsert({
      where: { id: entity.id },
      update: {
        status: entity.status as any,
        referenceId: entity.referenceId,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        amount: entity.amount,
        currency: entity.currency,
        status: entity.status as any,
        referenceId: entity.referenceId,
      },
    });
  }
}

export class InvoiceRepository {
  async findById(id: string): Promise<Invoice | null> {
    const row = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
    if (!row) return null;
    return new Invoice(row.id, {
      userId: row.userId,
      subscriptionId: row.subscriptionId || undefined,
      invoiceNumber: row.invoiceNumber,
      status: row.status,
      subTotal: row.subTotal,
      taxTotal: row.taxTotal,
      discountTotal: row.discountTotal,
      grandTotal: row.grandTotal,
      currency: row.currency,
      dueDate: row.dueDate,
      items: row.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount,
      })),
    }, 1, row.createdAt, row.updatedAt);
  }

  async save(entity: Invoice): Promise<void> {
    // Basic representation
    await prisma.invoice.upsert({
      where: { id: entity.id },
      update: {
        status: entity.status as any,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        invoiceNumber: entity.invoiceNumber,
        status: entity.status as any,
        subTotal: entity.grandTotal,
        taxTotal: 0.0,
        discountTotal: 0.0,
        grandTotal: entity.grandTotal,
        dueDate: new Date(),
      },
    });
  }
}

export class SubscriptionRepository {
  async findById(id: string): Promise<Subscription | null> {
    const row = await prisma.subscription.findUnique({ where: { id } });
    if (!row) return null;
    return new Subscription(row.id, {
      userId: row.userId,
      planId: row.planId,
      status: row.status,
      autoRenew: row.autoRenew,
      startedAt: row.startedAt,
      currentPeriodStart: row.currentPeriodStart,
      currentPeriodEnd: row.currentPeriodEnd,
      expiresAt: row.expiresAt || undefined,
    }, row.version, row.createdAt, row.updatedAt);
  }

  async save(entity: Subscription): Promise<void> {
    await prisma.subscription.upsert({
      where: { id: entity.id },
      update: {
        status: entity.status as any,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        planId: entity.planId,
        status: entity.status as any,
        autoRenew: true,
        startedAt: new Date(),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
}

export class UserWalletRepository {
  async findByUserId(userId: string): Promise<UserWallet | null> {
    const row = await prisma.userWallet.findUnique({ where: { userId } });
    if (!row) return null;
    return new UserWallet(row.id, {
      userId: row.userId,
      balance: row.balance,
      currency: row.currency,
    }, 1, row.createdAt, row.updatedAt);
  }

  async save(entity: UserWallet): Promise<void> {
    await prisma.userWallet.upsert({
      where: { id: entity.id },
      update: {
        balance: entity.balance,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        balance: entity.balance,
        currency: entity.currency,
      },
    });
  }
}

export class CouponRepository {
  async findByCode(code: string): Promise<Coupon | null> {
    const row = await prisma.coupon.findUnique({ where: { code } });
    if (!row) return null;
    return new Coupon(row.id, {
      campaignId: row.campaignId,
      code: row.code,
      type: row.type,
      value: row.value,
      usageLimit: row.usageLimit,
      usageCount: row.usageCount,
      maxPerUser: row.maxPerUser,
      expiresAt: row.expiresAt || undefined,
    }, 1, row.createdAt, row.createdAt);
  }

  async save(entity: Coupon): Promise<void> {
    await prisma.coupon.upsert({
      where: { id: entity.id },
      update: {
        usageCount: { increment: 1 },
      },
      create: {
        id: entity.id,
        campaignId: entity.id, // self-ref mock campaign
        code: entity.code,
        type: entity.type,
        value: entity.value,
        usageLimit: 100,
        usageCount: 0,
      },
    });
  }
}

export class PaymentIntentRepository {
  async findById(id: string): Promise<PaymentIntent | null> {
    const row = await prisma.paymentIntent.findUnique({ where: { id } });
    if (!row) return null;
    return new PaymentIntent(row.id, {
      userId: row.userId,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      paymentMethodId: row.paymentMethodId || undefined,
      clientSecret: row.clientSecret,
    }, 1, row.createdAt, row.updatedAt);
  }

  async save(entity: PaymentIntent): Promise<void> {
    await prisma.paymentIntent.upsert({
      where: { id: entity.id },
      update: {
        status: entity.status as any,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        amount: entity.amount,
        currency: entity.currency,
        status: entity.status as any,
        clientSecret: entity.clientSecret,
      },
    });
  }
}

export class PaymentMethodRepository {
  async findById(id: string): Promise<PaymentMethod | null> {
    const row = await prisma.paymentMethod.findUnique({ where: { id } });
    if (!row) return null;
    return new PaymentMethod(row.id, {
      userId: row.userId,
      type: row.type,
      provider: row.provider,
      token: row.token,
      last4: row.last4 || undefined,
      expiryMonth: row.expiryMonth || undefined,
      expiryYear: row.expiryYear || undefined,
      isDefault: row.isDefault,
    }, 1, row.createdAt, row.createdAt);
  }

  async save(entity: PaymentMethod): Promise<void> {
    await prisma.paymentMethod.upsert({
      where: { id: entity.id },
      update: {
        isDefault: entity.isDefault,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        type: entity.type as any,
        provider: entity.provider,
        token: entity.token,
        last4: entity.last4,
        expiryMonth: entity.expiryMonth,
        expiryYear: entity.expiryYear,
        isDefault: entity.isDefault,
      },
    });
  }
}

export class AccountRepository {
  async save(entity: Account): Promise<void> {
    await prisma.account.upsert({
      where: { id: entity.id },
      update: {
        name: entity.name,
      },
      create: {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        type: entity.type,
      },
    });
  }
}

export class JournalEntryRepository {
  async save(entity: JournalEntry): Promise<void> {
    await prisma.journalEntry.upsert({
      where: { id: entity.id },
      update: {
        postingStatus: entity.postingStatus as any,
      },
      create: {
        id: entity.id,
        referenceNumber: entity.referenceNumber,
        description: entity.description,
        postingStatus: entity.postingStatus as any,
      },
    });

    for (const entry of entity.entries) {
      await prisma.ledgerEntry.create({
        data: {
          id: generateUuidV7(),
          journalEntryId: entity.id,
          accountId: entry.accountId,
          entryType: entry.entryType,
          amount: entry.amount,
        },
      });
    }
  }
}
function generateUuidV7(): string {
  return 'uuid-' + Math.random().toString(36).substring(2, 15);
}
