import { PaymentAggregate } from './payment.aggregate';

export interface IPaymentRepository {
  findById(id: string): Promise<PaymentAggregate | null>;
  findByIntentId(intentId: string): Promise<PaymentAggregate | null>;
  findByReferenceId(refId: string): Promise<PaymentAggregate | null>;
  save(aggregate: PaymentAggregate, tx?: any): Promise<void>;
  
  saveWebhookEvent(event: any, tx?: any): Promise<void>;
  findWebhookEventByExternalId(extId: string): Promise<any | null>;
  
  saveIdempotencyRecord(record: { key: string; requestHash: string; responseHash: string; expiresAt: Date }): Promise<void>;
  findIdempotencyRecord(key: string): Promise<any | null>;
  
  createIntent(data: any): Promise<any>;
  findIntentById(id: string): Promise<any | null>;
  updateIntentStatus(id: string, status: string): Promise<any>;
  
  createPaymentLog(data: { paymentId?: string; orderId?: string; action: string; details: any }, tx?: any): Promise<void>;
  
  saveReconciliation(data: { id: string; paymentId: string; externalReference: string; status: string; matched: boolean }): Promise<void>;
}

export const IPaymentRepository = Symbol('IPaymentRepository');
