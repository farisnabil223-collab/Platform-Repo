import { Injectable } from '@nestjs/common';
import { IBillingRepository } from '../domain/billing.repository.interface';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class PrismaBillingRepository implements IBillingRepository {
  async createInvoice(data: any, tx?: any): Promise<any> {
    const client = tx || prisma;
    return client.invoice.create({
      data: {
        id: data.id || generateUuidV7(),
        userId: data.userId,
        invoiceNumber: data.invoiceNumber,
        status: data.status as any,
        subTotal: data.subTotal,
        taxTotal: data.taxTotal,
        discountTotal: data.discountTotal,
        grandTotal: data.grandTotal,
        currency: data.currency || 'USD',
        dueDate: data.dueDate,
        orderId: data.orderId,
      },
    });
  }

  async findInvoiceById(id: string): Promise<any | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: { file: true, order: true },
    });
  }

  async findInvoiceByOrderNumber(orderNumber: string): Promise<any | null> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (!order) return null;
    return prisma.invoice.findFirst({
      where: { orderId: order.id },
      include: { file: true, order: true },
    });
  }

  async saveInvoiceFile(invoiceId: string, fileUrl: string, tx?: any): Promise<void> {
    const client = tx || prisma;
    await client.invoiceFile.create({
      data: {
        id: generateUuidV7(),
        invoiceId,
        fileUrl,
      },
    });
  }

  async findInvoiceFile(invoiceId: string): Promise<string | null> {
    const record = await prisma.invoiceFile.findUnique({
      where: { invoiceId },
    });
    return record ? record.fileUrl : null;
  }
}
