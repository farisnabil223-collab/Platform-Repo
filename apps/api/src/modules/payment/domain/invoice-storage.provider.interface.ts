export interface IInvoiceStorageProvider {
  uploadInvoice(invoiceId: string, pdfBuffer: Buffer): Promise<string>;
  downloadInvoice(invoiceId: string): Promise<Buffer>;
}

export const IInvoiceStorageProvider = Symbol('IInvoiceStorageProvider');
