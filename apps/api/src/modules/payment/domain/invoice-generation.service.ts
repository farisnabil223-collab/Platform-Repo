export interface InvoiceDetails {
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
  subtotal: number;
  tax: number;
  grandTotal: number;
  issueDate: Date;
  status: string;
}

export class InvoiceGenerationService {
  generateInvoiceData(order: any, invoiceNumber: string, taxRate = 0): InvoiceDetails {
    const subtotal = order.totalAmount?.toNumber ? order.totalAmount.toNumber() : Number(order.totalAmount || 0);
    const discount = order.discountAmount?.toNumber ? order.discountAmount.toNumber() : Number(order.discountAmount || 0);
    const tax = subtotal * taxRate;
    const grandTotal = subtotal - discount + tax;

    return {
      invoiceNumber,
      orderNumber: order.orderNumber,
      customerName: order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Valued Customer' : 'Valued Customer',
      customerEmail: order.user?.email || 'N/A',
      items: order.items.map((i: any) => ({
        name: i.productName,
        quantity: i.quantity,
        price: i.price?.toNumber ? i.price.toNumber() : Number(i.price || 0),
        discount: i.discount?.toNumber ? i.discount.toNumber() : Number(i.discount || 0),
      })),
      subtotal,
      tax,
      grandTotal,
      issueDate: new Date(),
      status: 'PAID',
    };
  }
}
