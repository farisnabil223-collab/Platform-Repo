export class PaymentException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'PaymentException';
  }
}

export class PaymentGatewayException extends PaymentException {
  constructor(message: string, details?: any) {
    super(message, 'PAYMENT_GATEWAY_ERROR', details);
  }
}

export class SignatureVerificationException extends PaymentException {
  constructor(message = 'Invalid webhook signature') {
    super(message, 'INVALID_SIGNATURE');
  }
}

export class IdempotencyConflictException extends PaymentException {
  constructor(key: string) {
    super(`Conflict: Duplicate request processed for key: ${key}`, 'IDEMPOTENCY_CONFLICT');
  }
}
