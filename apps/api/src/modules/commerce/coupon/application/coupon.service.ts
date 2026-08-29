import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { ICouponRepository } from '../domain/coupon.repository.interface';
import { CouponValidationService, Money } from '@eduverse/shared-domain';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class CouponService {
  private readonly validator = new CouponValidationService();

  constructor(
    @Inject(ICouponRepository)
    private readonly couponRepo: ICouponRepository
  ) {}

  async validateCoupon(code: string, userId: string, subtotal: number, cartItems: any[]) {
    const coupon = await this.couponRepo.findByCode(code);
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new BadRequestException('Coupon is inactive');

    // 1. Gather context metrics
    const isFirstPurchase = (await prisma.order.count({ where: { userId, status: 'PAID' } })) === 0;
    const userUsageCount = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId } });
    const totalUsageCount = await prisma.couponUsage.count({ where: { couponId: coupon.id } });

    // Extract categories or target specifics
    const cartProductIds = cartItems.map((i) => i.productId);
    const cartBundleIds = cartItems.filter((i) => i.product.type === 'BUNDLE').map((i) => i.product.targetId);
    const cartTeacherIds: string[] = []; // Subscriptions or courses can map to teacher id
    const cartSubjectIds: string[] = [];

    const context = {
      userId,
      cartSubtotal: Money.create(subtotal, 'USD'),
      isFirstPurchase,
      userUsageCount,
      totalUsageCount,
      cartProductIds,
      cartBundleIds,
      cartTeacherIds,
      cartSubjectIds,
    };

    // 2. Perform Rule Engine checks
    const result = this.validator.validateCoupon(coupon, context);
    if (!result.valid) {
      throw new BadRequestException(result.reason || 'Coupon validation failed');
    }

    // 3. Compute discount amount
    const discountMoney = this.validator.calculateDiscount(coupon, context.cartSubtotal);

    return {
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount: discountMoney.toNumber(),
    };
  }

  async getCoupons(page: number, limit: number) {
    const data = await this.couponRepo.findMany({ page, limit });
    return {
      items: data.items,
      page,
      limit,
      total: data.total,
      totalPages: Math.ceil(data.total / limit),
    };
  }

  async createCoupon(data: any) {
    return this.couponRepo.create({
      id: generateUuidV7(),
      ...data,
      value: Number(data.value),
      minPurchase: data.minPurchase ? Number(data.minPurchase) : null,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
    });
  }

  async updateCoupon(id: string, data: any) {
    return this.couponRepo.update(id, data);
  }

  async deleteCoupon(id: string) {
    return this.couponRepo.softDelete(id);
  }
}
