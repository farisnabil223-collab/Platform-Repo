export interface IBillingRepository {
  createInvoice(data: any, tx?: any): Promise<any>;
  findInvoiceById(id: string): Promise<any | null>;
  findInvoiceByOrderNumber(orderNumber: string): Promise<any | null>;
  saveInvoiceFile(invoiceId: string, fileUrl: string, tx?: any): Promise<void>;
  findInvoiceFile(invoiceId: string): Promise<string | null>;
}

export const IBillingRepository = Symbol('IBillingRepository');
