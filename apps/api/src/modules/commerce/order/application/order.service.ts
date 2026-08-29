import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '../domain/order.repository.interface';
import { CartService } from '../../cart/application/cart.service';
import { OrderFactory, CanCreateOrderSpec } from '@eduverse/shared-domain';
import { OrderStatus, TimelineEventType } from '@prisma/client';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class OrderService {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepo: IOrderRepository,
    private readonly cartService: CartService
  ) {}

  async createOrderFromCart(userId: string, idempotencyKey?: string, couponCode?: string) {
    // 1. Idempotency check
    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: { include: { product: true } } },
      });
      if (existing) {
        return existing;
      }
    }

    const cart = await this.cartService.getOrCreateCart(userId);

    // 2. Validate using Specifications
    const spec = new CanCreateOrderSpec();
    if (!spec.isSatisfiedBy(cart)) {
      throw new BadRequestException('Cart contains expired, inactive, or invalid products');
    }

    // 3. Compute Totals
    const totals = await this.cartService.calculateCartTotals(userId, couponCode);

    // 4. Use OrderFactory to construct the complete order block
    const orderData = OrderFactory.createOrder({
      userId,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      cartItems: cart.items,
      idempotencyKey,
    });

    return prisma.$transaction(async (tx) => {
      // 5. Persist the Order in Database
      const order = await this.orderRepo.createOrder({
        ...orderData,
        status: 'PENDING_PAYMENT',
        idempotencyKey,
      }, tx);

      // 6. Persist Audit Log
      await tx.auditLog.create({
        data: {
          id: orderData.auditLog.id,
          action: orderData.auditLog.action,
          userId: orderData.auditLog.userId,
          entityId: orderData.auditLog.entityId,
          entity: 'ORDER',
          details: JSON.parse(orderData.auditLog.metadata),
          createdAt: orderData.auditLog.createdAt,
        },
      });

      // 7. Clear Cart
      await this.cartService.clearCart(userId, tx);

      // 8. Generate Invoice draft
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // 3 days terms

      await this.orderRepo.createInvoice({
        id: generateUuidV7(),
        invoiceNumber,
        orderId: order.id,
        userId,
        subTotal: totals.subtotal,
        discountTotal: totals.discount,
        taxTotal: totals.tax,
        grandTotal: totals.total,
        currency: 'USD',
        dueDate,
        status: 'DRAFT',
      }, tx);

      return order;
    });
  }

  async getOrderById(id: string) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getOrders(params: { userId?: string; status?: OrderStatus; page: number; limit: number }) {
    const data = await this.orderRepo.findMany(params);
    return {
      items: data.items,
      page: params.page,
      limit: params.limit,
      total: data.total,
      totalPages: Math.ceil(data.total / params.limit),
    };
  }

  async addTimelineEvent(orderId: string, event: TimelineEventType, notes?: string) {
    await this.getOrderById(orderId);
    return this.orderRepo.createTimelineEvent({
      id: generateUuidV7(),
      orderId,
      event,
      notes,
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus, notes?: string) {
    const order = await this.getOrderById(id);
    const updated = await this.orderRepo.updateOrderStatus(id, status);

    await this.addTimelineEvent(id, status as any, notes || `Order status updated to ${status}`);

    return updated;
  }
}
