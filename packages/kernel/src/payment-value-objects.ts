export class Money {
  constructor(public readonly amount: number, public readonly currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money of different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money of different currencies');
    }
    const diff = this.amount - other.amount;
    if (diff < 0) {
      throw new Error('Resulting money amount cannot be negative');
    }
    return new Money(diff, this.currency);
  }
}

export class CouponCode {
  constructor(public readonly code: string) {
    if (!code || code.trim().length === 0) {
      throw new Error('Coupon code cannot be empty');
    }
  }
}
