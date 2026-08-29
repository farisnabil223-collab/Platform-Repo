import { PaymentStatus } from '@eduverse/payment-core';

export class PaymentVerificationService {
  verifyAmount(expected: number, actual: number): boolean {
    // Check if amount matches (within minor precision margin, e.g. cents difference)
    return Math.abs(expected - actual) < 0.01;
  }

  verifyCurrency(expected: string, actual: string): boolean {
    return expected.toUpperCase() === actual.toUpperCase();
  }

  isCaptured(status: PaymentStatus): boolean {
    return status === PaymentStatus.CAPTURED;
  }
}
