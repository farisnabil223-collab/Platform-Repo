import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';
import { BundleModule } from './bundle/bundle.module';
import { EntitlementModule } from './entitlement/entitlement.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ProductModule,
    CartModule,
    OrderModule,
    CouponModule,
    BundleModule,
    EntitlementModule,
    SubscriptionModule,
  ],
  exports: [
    ProductModule,
    CartModule,
    OrderModule,
    CouponModule,
    BundleModule,
    EntitlementModule,
    SubscriptionModule,
  ],
})
export class CommerceModule {}
