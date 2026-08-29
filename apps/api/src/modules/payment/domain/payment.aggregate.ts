import { PaymentStatus, PaymentMethod, PaymentProvider } from '@eduverse/payment-core';

export class PaymentAggregate {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public amount: number,
    public currency: string,
    public status: PaymentStatus,
    public referenceId: string | null,
    public readonly attempts: any[] = [],
    public readonly refunds: any[] = [],
    public readonly logs: any[] = []
  ) {}

  static create(data: { id: string; userId: string; amount: number; currency: string }) {
    return new PaymentAggregate(
      data.id,
      data.userId,
      data.amount,
      data.currency,
      PaymentStatus.CREATED,
      null
    );
  }

  addAttempt(attempt: {
    id: string;
    gatewayName: PaymentProvider;
    amount: number;
    attemptNumber: number;
    method?: PaymentMethod;
  }) {
    this.attempts.push({
      ...attempt,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
    });
  }

  recordSuccess(referenceId: string) {
    this.status = PaymentStatus.CAPTURED;
    this.referenceId = referenceId;
  }

  recordFailure() {
    this.status = PaymentStatus.FAILED;
  }

  refund(amount: number, reason: string) {
    if (this.status !== PaymentStatus.CAPTURED && this.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new Error('Only captured or partially refunded payments can be refunded');
    }
    const refundedTotal = this.refunds.reduce((sum, r) => sum + r.amount, 0) + amount;
    if (refundedTotal > this.amount) {
      throw new Error('Refund amount exceeds initial payment total');
    }
    
    this.refunds.push({
      id: Math.random().toString(36).substring(7), // simulated UUID
      amount,
      reason,
      status: 'COMPLETED',
      createdAt: new Date(),
    });

    if (refundedTotal === this.amount) {
      this.status = PaymentStatus.REFUNDED;
    } else {
      this.status = PaymentStatus.PARTIALLY_REFUNDED;
    }
  }
}
