import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../domain/payment.repository.interface';
import { PaymentAggregate } from '../domain/payment.aggregate';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { PaymentStatus, PaymentProviderEnum, PaymentMethodEnum, WebhookStatus } from '@prisma/client';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  private mapToAggregate(payment: any): PaymentAggregate {
    return new PaymentAggregate(
      payment.id,
      payment.userId,
      payment.amount,
      payment.currency,
      payment.status as any,
      payment.referenceId,
      payment.attempts || [],
      payment.refunds || []
    );
  }

  async findById(id: string): Promise<PaymentAggregate | null> {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { attempts: true, refunds: true },
    });
    if (!payment) return null;
    return this.mapToAggregate(payment);
  }

  async findByIntentId(intentId: string): Promise<PaymentAggregate | null> {
    const payment = await prisma.payment.findFirst({
      where: { intentId },
      include: { attempts: true, refunds: true },
    });
    if (!payment) return null;
    return this.mapToAggregate(payment);
  }

  async findByReferenceId(referenceId: string): Promise<PaymentAggregate | null> {
    const payment = await prisma.payment.findFirst({
      where: { referenceId },
      include: { attempts: true, refunds: true },
    });
    if (!payment) return null;
    return this.mapToAggregate(payment);
  }

  async save(aggregate: PaymentAggregate, tx?: any): Promise<void> {
    const client = tx || prisma;
    
    // Save/update root payment
    await client.payment.upsert({
      where: { id: aggregate.id },
      update: {
        status: aggregate.status as PaymentStatus,
        referenceId: aggregate.referenceId,
      },
      create: {
        id: aggregate.id,
        userId: aggregate.userId,
        amount: aggregate.amount,
        currency: aggregate.currency,
        status: aggregate.status as PaymentStatus,
        referenceId: aggregate.referenceId,
      },
    });

    // Save attempts
    for (const attempt of aggregate.attempts) {
      await client.paymentAttempt.upsert({
        where: { id: attempt.id },
        update: {
          status: attempt.status as PaymentStatus,
          finishedAt: attempt.finishedAt,
          responseTime: attempt.responseTime,
        },
        create: {
          id: attempt.id,
          paymentId: aggregate.id,
          gatewayName: attempt.gatewayName as PaymentProviderEnum,
          gatewayRef: attempt.gatewayRef,
          amount: attempt.amount,
          status: attempt.status as PaymentStatus,
          attemptNumber: attempt.attemptNumber,
          method: attempt.method as PaymentMethodEnum,
          finishedAt: attempt.finishedAt,
          responseTime: attempt.responseTime,
        },
      });
    }

    // Save refunds
    for (const refund of aggregate.refunds) {
      await client.refund.upsert({
        where: { id: refund.id },
        update: {
          status: refund.status,
        },
        create: {
          id: refund.id,
          paymentId: aggregate.id,
          amount: refund.amount,
          reason: refund.reason,
          status: refund.status,
        },
      });
    }
  }

  async saveWebhookEvent(event: any, tx?: any): Promise<void> {
    const client = tx || prisma;
    await client.webhookEvent.upsert({
      where: { id: event.id },
      update: {
        status: event.status as WebhookStatus,
        processedAt: event.processedAt,
        error: event.error,
      },
      create: {
        id: event.id,
        provider: event.provider as PaymentProviderEnum,
        externalId: event.externalId,
        payload: event.payload,
        status: event.status as WebhookStatus,
        error: event.error,
      },
    });
  }

  async findWebhookEventByExternalId(externalId: string): Promise<any | null> {
    return prisma.webhookEvent.findUnique({
      where: { externalId },
    });
  }

  async saveIdempotencyRecord(record: { key: string; requestHash: string; responseHash: string; expiresAt: Date }): Promise<void> {
    await prisma.idempotencyRecord.upsert({
      where: { key: record.key },
      update: {},
      create: {
        key: record.key,
        requestHash: record.requestHash,
        responseHash: record.responseHash,
        expiresAt: record.expiresAt,
      },
    });
  }

  async findIdempotencyRecord(key: string): Promise<any | null> {
    return prisma.idempotencyRecord.findUnique({
      where: { key },
    });
  }

  async createIntent(data: any): Promise<any> {
    return prisma.paymentIntent.create({
      data: {
        id: data.id,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        status: data.status as any,
        clientSecret: data.clientSecret,
        orderId: data.orderId,
      },
    });
  }

  async findIntentById(id: string): Promise<any | null> {
    return prisma.paymentIntent.findUnique({
      where: { id },
    });
  }

  async updateIntentStatus(id: string, status: string): Promise<any> {
    return prisma.paymentIntent.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async createPaymentLog(data: { paymentId?: string; orderId?: string; action: string; details: any }, tx?: any): Promise<void> {
    const client = tx || prisma;
    await client.paymentLog.create({
      data: {
        id: generateUuidV7(),
        paymentId: data.paymentId,
        orderId: data.orderId,
        action: data.action,
        details: data.details,
      },
    });
  }

  async saveReconciliation(data: { id: string; paymentId: string; externalReference: string; status: string; matched: boolean }): Promise<void> {
    await prisma.paymentReconciliation.create({
      data,
    });
  }
}
