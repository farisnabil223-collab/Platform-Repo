import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '@eduverse/payment-core';

export class RefundValidationService {
  validateRefund(payment: any, refundAmount: number) {
    if (payment.status !== PaymentStatus.CAPTURED && payment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new BadRequestException('Only captured or partially refunded payments are eligible for refunds');
    }
    if (refundAmount <= 0) {
      throw new BadRequestException('Refund amount must be greater than zero');
    }

    const alreadyRefunded = payment.refunds
      ? payment.refunds.reduce((sum: number, r: any) => sum + r.amount, 0)
      : 0;

    const remainingRefundable = payment.amount - alreadyRefunded;
    if (refundAmount > remainingRefundable) {
      throw new BadRequestException(`Refund amount exceeds remaining refundable amount (${remainingRefundable})`);
    }
  }
}
