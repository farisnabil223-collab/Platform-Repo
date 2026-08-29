import { Decimal } from 'decimal.js';

export class Money {
  private constructor(
    public readonly amount: Decimal,
    public readonly currency: string = 'USD',
    public readonly precision: number = 2,
    public readonly rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP
  ) {}

  public static create(amount: number | string | Decimal, currency = 'USD'): Money {
    const dec = new Decimal(amount);
    return new Money(dec, currency);
  }

  public static zero(currency = 'USD'): Money {
    return new Money(new Decimal(0), currency);
  }

  public add(other: Money): Money {
    this.checkCurrency(other);
    return new Money(this.amount.add(other.amount), this.currency);
  }

  public subtract(other: Money): Money {
    this.checkCurrency(other);
    return new Money(this.amount.sub(other.amount), this.currency);
  }

  public multiply(factor: number | Decimal): Money {
    return new Money(this.amount.mul(factor), this.currency);
  }

  public applyDiscount(percentage: number): Money {
    const discountFactor = new Decimal(1).sub(new Decimal(percentage).div(100));
    return new Money(this.amount.mul(discountFactor), this.currency);
  }

  public equals(other: Money): boolean {
    return this.currency === other.currency && this.amount.eq(other.amount);
  }

  public greaterThan(other: Money): boolean {
    this.checkCurrency(other);
    return this.amount.gt(other.amount);
  }

  public lessThan(other: Money): boolean {
    this.checkCurrency(other);
    return this.amount.lt(other.amount);
  }

  public toFixed(): string {
    return this.amount.toFixed(this.precision, this.rounding);
  }

  public toNumber(): number {
    return this.amount.toNumber();
  }

  private checkCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: cannot perform operation between ${this.currency} and ${other.currency}`);
    }
  }
}
