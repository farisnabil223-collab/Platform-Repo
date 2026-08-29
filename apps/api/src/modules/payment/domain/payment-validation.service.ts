import { BadRequestException } from '@nestjs/common';
import { CreatePaymentIntentInput } from '@eduverse/payment-core';

export class PaymentValidationService {
  validateIntent(input: CreatePaymentIntentInput) {
    if (!input.amount || input.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }
    if (!input.currency || input.currency.length !== 3) {
      throw new BadRequestException('Invalid currency code (must be 3 characters)');
    }
    if (!input.orderId) {
      throw new BadRequestException('Order ID is required to create a payment intent');
    }
    if (!input.userId) {
      throw new BadRequestException('User ID is required');
    }
  }
}
