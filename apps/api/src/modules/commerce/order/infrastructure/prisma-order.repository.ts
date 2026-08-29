import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../domain/order.repository.interface';
import { prisma } from '@eduverse/database';
import { OrderStatus, TimelineEventType } from '@prisma/client';
import { Decimal } from '@eduverse/shared-domain';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<any | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        invoices: true,
        timeline: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<any | null> {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
        invoices: true,
        timeline: true,
      },
    });
  }

  async findMany(params: {
    userId?: string;
    status?: OrderStatus;
    page: number;
    limit: number;
  }): Promise<{ items: any[]; total: number }> {
    const { userId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          invoices: true,
          timeline: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { items, total };
  }

  async createOrder(data: any, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.order.create({
      data: {
        id: data.id,
        userId: data.userId,
        orderNumber: data.orderNumber,
        totalAmount: new Decimal(data.totalAmount),
        discountAmount: new Decimal(data.discountAmount),
        taxAmount: new Decimal(data.taxAmount),
        netAmount: new Decimal(data.netAmount),
        status: data.status,
        idempotencyKey: data.idempotencyKey || null,
        items: {
          create: data.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            price: new Decimal(item.price),
            discount: new Decimal(item.discount),
            currency: item.currency,
            thumbnail: item.thumbnail,
            productType: item.productType,
            productVersion: item.productVersion,
            quantity: item.quantity,
          })),
        },
        timeline: {
          create: data.timeline.map((evt: any) => ({
            id: evt.id,
            event: evt.event as TimelineEventType,
            notes: evt.notes,
            createdAt: evt.createdAt,
          })),
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.order.update({
      where: { id },
      data: { status },
    });
  }

  async createTimelineEvent(data: any, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.orderTimelineEvent.create({
      data: {
        id: data.id,
        orderId: data.orderId,
        event: data.event as TimelineEventType,
        notes: data.notes,
      },
    });
  }

  async getTimelineEvents(orderId: string): Promise<any[]> {
    return prisma.orderTimelineEvent.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createInvoice(data: any, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.invoice.create({
      data: {
        id: data.id,
        invoiceNumber: data.invoiceNumber,
        orderId: data.orderId,
        userId: data.userId,
        subTotal: data.subTotal,
        discountTotal: data.discountTotal,
        taxTotal: data.taxTotal,
        grandTotal: data.grandTotal,
        currency: data.currency || 'USD',
        dueDate: data.dueDate,
        status: data.status === 'PAID' ? 'PAID' : 'DRAFT',
      },
    });
  }

  async updateInvoiceStatus(invoiceId: string, status: string, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.invoice.update({
      where: { id: invoiceId },
      data: {
        status: status === 'PAID' ? 'PAID' : 'DRAFT',
      },
    });
  }

  async findInvoiceById(id: string): Promise<any | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: { order: true },
    });
  }

  async findInvoiceByOrderNumber(orderNumber: string): Promise<any | null> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (!order) return null;
    return prisma.invoice.findFirst({
      where: { orderId: order.id },
      include: { order: true },
    });
  }
}
