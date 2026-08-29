import { Injectable } from '@nestjs/common';
import { InvoiceDetails } from '../domain/invoice-generation.service';

@Injectable()
export class PDFGenerator {
  async generateInvoicePDF(details: InvoiceDetails): Promise<Buffer> {
    // Generate a professional text/HTML layout representing the PDF document
    const htmlContent = `
=========================================
          EDUVERSE INVOICE RECEIPT
=========================================
Invoice Number: ${details.invoiceNumber}
Order Number:   ${details.orderNumber}
Issue Date:     ${details.issueDate.toISOString()}
Payment Status: ${details.status}

CUSTOMER DETAILS:
Name:           ${details.customerName}
Email:          ${details.customerEmail}

PURCHASED PRODUCTS:
${details.items
  .map(
    (item) =>
      `- ${item.name} x${item.quantity} - $${item.price} (Discount: $${item.discount})`
  )
  .join('\n')}

BILLING SUMMARY:
Subtotal:       $${details.subtotal}
Tax (VAT):      $${details.tax}
Grand Total:    $${details.grandTotal}
=========================================
Thank you for choosing EduVerse!
`;
    return Buffer.from(htmlContent, 'utf-8');
  }
}
