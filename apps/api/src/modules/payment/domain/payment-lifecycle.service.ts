import { PaymentStatus } from '@eduverse/payment-core';

export class PaymentLifecycleService {
  private readonly validTransitions: Record<PaymentStatus, Set<PaymentStatus>> = {
    [PaymentStatus.CREATED]: new Set([PaymentStatus.PENDING, PaymentStatus.FAILED, PaymentStatus.CANCELLED]),
    [PaymentStatus.PENDING]: new Set([PaymentStatus.AUTHORIZED, PaymentStatus.CAPTURED, PaymentStatus.FAILED, PaymentStatus.CANCELLED, PaymentStatus.EXPIRED]),
    [PaymentStatus.AUTHORIZED]: new Set([PaymentStatus.CAPTURED, PaymentStatus.CANCELLED, PaymentStatus.FAILED]),
    [PaymentStatus.CAPTURED]: new Set([PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED]),
    [PaymentStatus.PARTIALLY_REFUNDED]: new Set([PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED]),
    [PaymentStatus.FAILED]: new Set(),
    [PaymentStatus.CANCELLED]: new Set(),
    [PaymentStatus.REFUNDED]: new Set(),
    [PaymentStatus.EXPIRED]: new Set(),
  };

  validateTransition(current: PaymentStatus, target: PaymentStatus): boolean {
    if (current === target) return true;
    const allowed = this.validTransitions[current];
    return allowed ? allowed.has(target) : false;
  }
}
