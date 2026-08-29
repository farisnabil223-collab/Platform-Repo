import { generateUuidV7 } from '@eduverse/kernel';

export interface OrderCreationResult {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'DRAFT' | 'PENDING_PAYMENT';
  items: any[];
  timeline: any[];
  auditLog: any;
}

export class OrderFactory {
  public static createOrder(params: {
    userId: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    cartItems: any[];
    idempotencyKey?: string;
  }): OrderCreationResult {
    const orderId = generateUuidV7();
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(10000000 + Math.random() * 90000000);
    const orderNumber = `ORD-${year}-${randomSeq}`;

    const items = params.cartItems.map((cartItem) => {
      const product = cartItem.product;
      const price = product.discountPrice || product.price;
      const discount = product.discountPrice ? (product.price - product.discountPrice) : 0;

      return {
        id: generateUuidV7(),
        orderId,
        productId: product.id,
        productName: product.title,
        price,
        discount,
        currency: product.currency || 'USD',
        thumbnail: product.thumbnail || null,
        productType: product.type,
        productVersion: product.version || 1,
        quantity: cartItem.quantity,
      };
    });

    const timeline = [
      {
        id: generateUuidV7(),
        orderId,
        event: 'CREATED',
        notes: `Order generated via checkout workflow. Total due: $${params.total.toFixed(2)}`,
        createdAt: new Date(),
      },
    ];

    const auditLog = {
      id: generateUuidV7(),
      action: 'ORDER_CREATED',
      userId: params.userId,
      entityId: orderId,
      metadata: JSON.stringify({ orderNumber, total: params.total }),
      createdAt: new Date(),
    };

    return {
      id: orderId,
      orderNumber,
      userId: params.userId,
      totalAmount: params.subtotal,
      discountAmount: params.discount,
      taxAmount: params.tax,
      netAmount: params.total,
      status: 'PENDING_PAYMENT',
      items,
      timeline,
      auditLog,
    };
  }
}
