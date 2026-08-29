import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { PaymentStatus, PaymentMethod, PaymentProvider, CreatePaymentIntentInput } from '@eduverse/payment-core';
import { OrderStatus, TimelineEventType } from '@prisma/client';
import { PaymentProviderRegistry } from './payment-provider.registry';
import { PaymentLifecycleService } from '../domain/payment-lifecycle.service';
import { FraudDetectionService } from './fraud-detection.service';
import { IPaymentRepository } from '../domain/payment.repository.interface';
import { IBillingRepository } from '../domain/billing.repository.interface';
import { InvoiceGenerationService } from '../domain/invoice-generation.service';
import { IInvoiceStorageProvider } from '../domain/invoice-storage.provider.interface';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class PaymentOrchestrator {
  private readonly circuitBreakers = new Map<PaymentProvider, CircuitBreaker>();

  constructor(
    private readonly registry: PaymentProviderRegistry,
    private readonly lifecycleService: PaymentLifecycleService,
    private readonly fraudService: FraudDetectionService,
    private readonly invoiceGenService: InvoiceGenerationService,
    @Inject(IPaymentRepository)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(IBillingRepository)
    private readonly billingRepo: IBillingRepository,
    @Inject(IInvoiceStorageProvider)
    private readonly storageProvider: IInvoiceStorageProvider
  ) {}

  private getCircuitBreaker(provider: PaymentProvider): CircuitBreaker {
    if (!this.circuitBreakers.has(provider)) {
      this.circuitBreakers.set(provider, new CircuitBreaker());
    }
    return this.circuitBreakers.get(provider)!;
  }

  async createIntent(userId: string, orderId: string, providerName: PaymentProvider, method: PaymentMethod) {
    // 1. Fetch Order and validate ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { include: { student: true } }, items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Security Alert: Order ownership mismatch');
    if (order.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Order has already been processed or is not in payment pending state');
    }

    // 2. Fraud prevention check
    this.fraudService.validateRequest(userId, orderId, order.totalAmount.toNumber(), 'USD');

    // 3. Resolve Provider
    const provider = this.registry.resolve(providerName);
    const cb = this.getCircuitBreaker(providerName);

    const intentId = generateUuidV7();
    
    // Extract customer name from student academicMetadata
    let customerName = 'Valued Student';
    if (order.user?.student?.academicMetadata) {
      const meta = order.user.student.academicMetadata as any;
      if (meta && meta.name) {
        customerName = meta.name;
      }
    }

    const input: CreatePaymentIntentInput = {
      amount: order.totalAmount.toNumber(),
      currency: 'USD',
      orderId,
      userId,
      email: order.user?.email || '',
      name: customerName,
      metadata: { orderId, intentId },
    };

    // 4. Call Provider inside Circuit Breaker wrapper
    const gatewayRes = await cb.execute(providerName, () => provider.createPaymentIntent(input));

    // 5. Store Intent in DB
    const intent = await this.paymentRepo.createIntent({
      id: intentId,
      userId,
      amount: order.totalAmount.toNumber(),
      currency: 'USD',
      status: 'CREATED',
      clientSecret: gatewayRes.clientSecret,
      orderId,
    });

    // 6. Create Initial Payment and Attempt ledger entries
    const paymentId = generateUuidV7();
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          id: paymentId,
          userId,
          intentId,
          amount: order.totalAmount.toNumber(),
          currency: 'USD',
          status: 'PENDING',
          referenceId: gatewayRes.providerRef,
        },
      });

      await tx.paymentAttempt.create({
        data: {
          id: generateUuidV7(),
          paymentId,
          gatewayName: providerName,
          gatewayRef: gatewayRes.providerRef,
          amount: order.totalAmount.toNumber(),
          status: 'PENDING',
          attemptNumber: 1,
          method,
        },
      });

      await tx.paymentLog.create({
        data: {
          id: generateUuidV7(),
          paymentId,
          orderId,
          action: 'INTENT_CREATED',
          details: { provider: providerName, method, gatewayRes },
        },
      });
    });

    return {
      intentId,
      paymentId,
      clientSecret: gatewayRes.clientSecret,
      checkoutUrl: gatewayRes.checkoutUrl,
    };
  }

  async handleWebhook(providerName: PaymentProvider, headers: any, rawPayload: any) {
    const provider = this.registry.resolve(providerName);

    // 1. Webhook Signature Verification
    const config = await prisma.paymentProviderConfig.findUnique({
      where: { provider: providerName },
    });
    const secret = config ? (config.config as any).hmacSecret || '' : '';
    const isSignatureValid = await provider.validateWebhookSignature(headers, rawPayload, secret);
    if (!isSignatureValid) {
      throw new BadRequestException('Security Alert: Webhook signature verification failed');
    }

    // 2. Parse payload
    const parsed = await provider.parseWebhookPayload(rawPayload);

    // 3. Webhook Idempotency Check (Duplicate logs checking)
    const extId = parsed.transactionRef || parsed.providerRef;
    const existingWebhook = await this.paymentRepo.findWebhookEventByExternalId(extId);
    if (existingWebhook && existingWebhook.status === 'PROCESSED') {
      return { success: true, cached: true, msg: 'Webhook duplicate request ignored' };
    }

    // Store Webhook Event initial RECEIVED record
    const webhookEventId = generateUuidV7();
    await this.paymentRepo.saveWebhookEvent({
      id: webhookEventId,
      provider: providerName,
      externalId: extId,
      payload: rawPayload,
      status: 'RECEIVED',
    });

    // 4. Update Payment and Order statuses inside transactional boundary
    const payment = await prisma.payment.findFirst({
      where: { referenceId: parsed.providerRef },
      include: { intent: true },
    });

    if (!payment) {
      await this.paymentRepo.saveWebhookEvent({
        id: webhookEventId,
        provider: providerName,
        externalId: extId,
        payload: rawPayload,
        status: 'FAILED',
        error: 'Payment reference matching intent not found in DB',
      });
      throw new BadRequestException('Payment intent mismatch');
    }

    const orderId = payment.intent?.orderId;
    if (!orderId) throw new BadRequestException('Order matching payment intent not found');

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true },
    });
    if (!order) throw new NotFoundException('Associated order not found');

    // Validate transition
    const isValidTransition = this.lifecycleService.validateTransition(
      payment.status as PaymentStatus,
      parsed.status
    );
    if (!isValidTransition) {
      throw new BadRequestException(`Invalid lifecycle state transition from ${payment.status} to ${parsed.status}`);
    }

    // 5. Atomic Activation and Invoice generation
    await prisma.$transaction(async (tx) => {
      // Update Payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: parsed.status as any,
          updatedAt: new Date(),
        },
      });

      // Update Order status
      const orderStatus = parsed.status === PaymentStatus.CAPTURED ? OrderStatus.PAID : OrderStatus.CANCELLED;
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
          updatedAt: new Date(),
        },
      });

      // Add timeline event
      await tx.orderTimelineEvent.create({
        data: {
          id: generateUuidV7(),
          orderId,
          event: orderStatus === OrderStatus.PAID ? TimelineEventType.PAID : TimelineEventType.CANCELLED,
          notes: `Payment reference: ${parsed.transactionRef || 'N/A'}. Gateway status: ${parsed.status}`,
        },
      });

      // Handle successful capture logic (Entitlements, Subscription Activations, Invoices, Outbox events)
      if (parsed.status === PaymentStatus.CAPTURED) {
        // A. Generate Entitlements for all items inside the order
        for (const item of order.items) {
          const entitlementId = generateUuidV7();
          await tx.entitlement.create({
            data: {
              id: entitlementId,
              ownerId: order.userId,
              productId: item.productId,
              type: item.productType === 'COURSE' ? 'COURSE_ACCESS' : 'BUNDLE_ACCESS',
              status: 'ACTIVE',
              grantSource: 'ORDER',
              orderId,
            },
          });

          // B. Activate subscription if subscription product
          if (item.productType.endsWith('_SUBSCRIPTION')) {
            await tx.subscription.create({
              data: {
                id: generateUuidV7(),
                userId: order.userId,
                planId: item.productId, // resolves plan
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days period
              },
            });

            // Outbox Subscription event
            await tx.outboxEvent.create({
              data: {
                id: generateUuidV7(),
                aggregate: 'Subscription',
                eventType: 'SubscriptionActivated',
                payload: { userId: order.userId, orderId },
              },
            });
          }
        }

        // C. Generate Invoice number using standard human-readable format: INV-YYYY-XXXXXXXXX
        const currentYear = new Date().getFullYear();
        const invoiceSequence = Math.floor(100000000 + Math.random() * 900000000);
        const invoiceNumber = `INV-${currentYear}-${invoiceSequence}`;

        // Create Invoice record
        const invoiceId = generateUuidV7();
        await tx.invoice.create({
          data: {
            id: invoiceId,
            userId: order.userId,
            invoiceNumber,
            status: 'PAID',
            subTotal: order.totalAmount.toNumber(),
            taxTotal: 0.0,
            discountTotal: order.discountAmount.toNumber(),
            grandTotal: order.netAmount.toNumber(),
            dueDate: new Date(),
            orderId,
          },
        });

        // Trigger Outbox invoice creation event
        await tx.outboxEvent.create({
          data: {
            id: generateUuidV7(),
            aggregate: 'Invoice',
            eventType: 'InvoiceGenerated',
            payload: { invoiceId, orderId, invoiceNumber },
          },
        });
      }

      // Update Webhook Event RECEIVED log to PROCESSED
      await tx.webhookEvent.update({
        where: { id: webhookEventId },
        data: {
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });

      // Log success in PaymentLog
      await tx.paymentLog.create({
        data: {
          id: generateUuidV7(),
          paymentId: payment.id,
          orderId,
          action: 'CALLBACK_PROCESSED',
          details: { status: parsed.status, ref: extId },
        },
      });
    });

    return { success: true, status: parsed.status };
  }
}
