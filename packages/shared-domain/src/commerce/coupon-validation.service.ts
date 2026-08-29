import { ICouponRule, ExpirationRule, MinimumPurchaseRule, FirstPurchaseRule, UserLimitRule, TargetRule, CouponValidationContext } from './coupon-rule';
import { Money } from '../value-objects/money';

export class CouponValidationService {
  private readonly rules: ICouponRule[] = [
    new ExpirationRule(),
    new MinimumPurchaseRule(),
    new FirstPurchaseRule(),
    new UserLimitRule(),
    new TargetRule(),
  ];

  public validateCoupon(coupon: any, context: CouponValidationContext): { valid: boolean; reason?: string } {
    for (const rule of this.rules) {
      const result = rule.validate(coupon, context);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  }

  public calculateDiscount(coupon: any, subtotal: Money): Money {
    if (coupon.type === 'PERCENTAGE') {
      const discountAmount = subtotal.multiply(coupon.value / 100);
      if (coupon.maxDiscount) {
        const maxDisc = Money.create(coupon.maxDiscount, subtotal.currency);
        return discountAmount.greaterThan(maxDisc) ? maxDisc : discountAmount;
      }
      return discountAmount;
    } else if (coupon.type === 'FIXED_AMOUNT') {
      const discountAmount = Money.create(coupon.value, subtotal.currency);
      return discountAmount.greaterThan(subtotal) ? subtotal : discountAmount;
    }
    return Money.zero(subtotal.currency);
  }
}
