import { DomainEvent } from './domain-event';

export class SubscriptionCreated extends DomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly planId: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class InvoicePaid extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly amount: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class PaymentFailed extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly errorCode: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class LicenseActivated extends DomainEvent {
  constructor(
    public readonly licenseId: string,
    public readonly licenseKey: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class UsageQuotaExceeded extends DomainEvent {
  constructor(
    public readonly subId: string,
    public readonly metricType: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class CommissionEarned extends DomainEvent {
  constructor(
    public readonly partnerId: string,
    public readonly commissionAmount: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class MarketplaceOrderPlaced extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly productId: string,
    tenantId: string
  ) {
    super(tenantId);
  }
}

export class HealthScoreUpdated extends DomainEvent {
  constructor(
    public readonly healthScoreId: string,
    public readonly score: number,
    tenantId: string
  ) {
    super(tenantId);
  }
}
