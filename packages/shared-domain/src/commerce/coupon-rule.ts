import { Money } from '../value-objects/money';

export interface CouponValidationContext {
  userId: string;
  cartSubtotal: Money;
  isFirstPurchase: boolean;
  userUsageCount: number;
  totalUsageCount: number;
  cartProductIds: string[];
  cartBundleIds: string[];
  cartTeacherIds: string[];
  cartSubjectIds: string[];
}

export interface ICouponRule {
  validate(coupon: any, context: CouponValidationContext): { valid: boolean; reason?: string };
}

export class ExpirationRule implements ICouponRule {
  validate(coupon: any, _context: CouponValidationContext) {
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return { valid: false, reason: 'Coupon campaign has not started yet' };
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return { valid: false, reason: 'Coupon has expired' };
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return { valid: false, reason: 'Coupon has expired' };
    }
    return { valid: true };
  }
}

export class MinimumPurchaseRule implements ICouponRule {
  validate(coupon: any, context: CouponValidationContext) {
    const minPurchase = Money.create(coupon.minPurchase || 0, context.cartSubtotal.currency);
    if (context.cartSubtotal.lessThan(minPurchase)) {
      return {
        valid: false,
        reason: `Minimum purchase of $${minPurchase.toFixed()} required`,
      };
    }
    return { valid: true };
  }
}

export class FirstPurchaseRule implements ICouponRule {
  validate(coupon: any, context: CouponValidationContext) {
    if (coupon.code.toLowerCase().includes('welcome') || coupon.targetType === 'FIRST_PURCHASE') {
      if (!context.isFirstPurchase) {
        return { valid: false, reason: 'Coupon only valid for first purchase' };
      }
    }
    return { valid: true };
  }
}

export class UserLimitRule implements ICouponRule {
  validate(coupon: any, context: CouponValidationContext) {
    if (coupon.maxPerUser && context.userUsageCount >= coupon.maxPerUser) {
      return { valid: false, reason: 'Coupon usage limit per user reached' };
    }
    if (coupon.maxUsage && context.totalUsageCount >= coupon.maxUsage) {
      return { valid: false, reason: 'Coupon total usage limit reached' };
    }
    return { valid: true };
  }
}

export class TargetRule implements ICouponRule {
  validate(coupon: any, context: CouponValidationContext) {
    if (!coupon.targetType || coupon.targetType === 'GLOBAL' || coupon.targetType === 'ALL') {
      return { valid: true };
    }

    if (coupon.targetType === 'PRODUCT' && coupon.targetId) {
      if (!context.cartProductIds.includes(coupon.targetId)) {
        return { valid: false, reason: 'Coupon is not applicable to any products in cart' };
      }
    }

    if (coupon.targetType === 'BUNDLE' && coupon.targetId) {
      if (!context.cartBundleIds.includes(coupon.targetId)) {
        return { valid: false, reason: 'Coupon is not applicable to any bundles in cart' };
      }
    }

    if (coupon.targetType === 'TEACHER' && coupon.targetId) {
      if (!context.cartTeacherIds.includes(coupon.targetId)) {
        return { valid: false, reason: 'Coupon is not applicable to any teachers in cart' };
      }
    }

    if (coupon.targetType === 'SUBJECT' && coupon.targetId) {
      if (!context.cartSubjectIds.includes(coupon.targetId)) {
        return { valid: false, reason: 'Coupon is not applicable to any subjects in cart' };
      }
    }

    return { valid: true };
  }
}
