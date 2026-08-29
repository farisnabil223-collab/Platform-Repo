import { Injectable } from '@nestjs/common';
import { IInvoiceStorageProvider } from '../domain/invoice-storage.provider.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalInvoiceStorageProvider implements IInvoiceStorageProvider {
  private readonly storageDir = path.join(process.cwd(), 'uploads', 'invoices');

  constructor() {
    // Ensure storage directory exists
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async uploadInvoice(invoiceId: string, pdfBuffer: Buffer): Promise<string> {
    const filePath = path.join(this.storageDir, `${invoiceId}.pdf`);
    await fs.promises.writeFile(filePath, pdfBuffer);
    return `/uploads/invoices/${invoiceId}.pdf`;
  }

  async downloadInvoice(invoiceId: string): Promise<Buffer> {
    const filePath = path.join(this.storageDir, `${invoiceId}.pdf`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Invoice file not found for ID: ${invoiceId}`);
    }
    return fs.promises.readFile(filePath);
  }
}
