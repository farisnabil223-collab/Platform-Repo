import { OrderStatus } from '@prisma/client';

export interface IOrderRepository {
  findById(id: string): Promise<any | null>;
  findByOrderNumber(orderNumber: string): Promise<any | null>;
  findMany(params: {
    userId?: string;
    status?: OrderStatus;
    page: number;
    limit: number;
  }): Promise<{ items: any[]; total: number }>;
  createOrder(data: any, tx?: any): Promise<any>;
  updateOrderStatus(id: string, status: OrderStatus, tx?: any): Promise<any>;
  createTimelineEvent(data: any, tx?: any): Promise<any>;
  getTimelineEvents(orderId: string): Promise<any[]>;
  createInvoice(data: any, tx?: any): Promise<any>;
  updateInvoiceStatus(invoiceId: string, status: string, tx?: any): Promise<any>;
  findInvoiceById(id: string): Promise<any | null>;
  findInvoiceByOrderNumber(orderNumber: string): Promise<any | null>;
}

export const IOrderRepository = Symbol('IOrderRepository');
