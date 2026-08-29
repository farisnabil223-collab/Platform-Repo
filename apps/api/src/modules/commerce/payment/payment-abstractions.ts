export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  MOBILE_WALLET = 'MOBILE_WALLET',
  PAYPAL = 'PAYPAL',
  STRIPE = 'STRIPE',
}

export interface IPaymentProvider {
  getName(): string;
  charge(amount: number, currency: string, orderId: string): Promise<{ success: boolean; transactionId: string }>;
}

export interface IPaymentService {
  processPayment(orderId: string, method: PaymentMethod, token: string): Promise<{ success: boolean; transactionId: string }>;
}

export interface PaymentEntity {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  referenceId?: string;
  createdAt: Date;
}

export interface PaymentTransactionEntity {
  id: string;
  orderId: string;
  type: 'CHARGE' | 'REFUND' | 'VOID';
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  reference?: string;
  createdAt: Date;
}
