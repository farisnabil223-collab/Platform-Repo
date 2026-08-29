import { PaymentStatus, PaymentMethod } from '../enums/payment.enum';

export interface CreatePaymentIntentInput {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  email: string;
  name: string;
  phone?: string;
  metadata?: any;
}

export interface IPaymentProvider {
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<{
    providerRef: string;
    clientSecret: string;
    checkoutUrl?: string;
    rawResponse: any;
  }>;

  verifyPayment(providerRef: string, payload: any): Promise<{
    status: PaymentStatus;
    transactionRef?: string;
    amountPaid?: number;
    rawResponse: any;
  }>;

  capturePayment(providerRef: string, amount: number): Promise<{
    status: PaymentStatus;
    rawResponse: any;
  }>;

  cancelPayment(providerRef: string): Promise<{
    status: PaymentStatus;
    rawResponse: any;
  }>;

  refundPayment(providerRef: string, amount: number): Promise<{
    status: PaymentStatus;
    transactionRef?: string;
    rawResponse: any;
  }>;

  validateWebhookSignature(headers: any, body: any, secret: string): Promise<boolean>;

  parseWebhookPayload(payload: any): Promise<{
    providerRef: string;
    status: PaymentStatus;
    amountPaid?: number;
    transactionRef?: string;
    method?: PaymentMethod;
    rawPayload: any;
  }>;
}
