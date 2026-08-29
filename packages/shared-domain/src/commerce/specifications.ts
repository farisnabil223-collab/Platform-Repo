import { Specification } from '../specification/specification';
import { CouponValidationContext } from './coupon-rule';
import { CouponValidationService } from './coupon-validation.service';

export class CanPurchaseProductSpec extends Specification<any> {
  public isSatisfiedBy(product: any): boolean {
    if (!product) return false;
    if (!product.isActive) return false;
    if (product.visibility === 'HIDDEN') return false;
    // Expiration check
    const now = new Date();
    if (product.unpublishedAt && new Date(product.unpublishedAt) < now) {
      return false;
    }
    return true;
  }
}

export class CanApplyCouponSpec extends Specification<{ coupon: any; context: CouponValidationContext }> {
  private readonly validator = new CouponValidationService();

  public isSatisfiedBy(candidate: { coupon: any; context: CouponValidationContext }): boolean {
    const result = this.validator.validateCoupon(candidate.coupon, candidate.context);
    return result.valid;
  }
}

export class CanCreateOrderSpec extends Specification<any> {
  public isSatisfiedBy(cart: any): boolean {
    if (!cart) return false;
    if (!cart.items || cart.items.length === 0) return false;
    // Ensure all items satisfy purchase rules
    const productSpec = new CanPurchaseProductSpec();
    const allValid = cart.items.every((item: any) => productSpec.isSatisfiedBy(item.product));
    return allValid;
  }
}
