import { Module } from '@nestjs/common';
import { CouponController } from './presentation/coupon.controller';
import { CouponService } from './application/coupon.service';
import { ICouponRepository } from './domain/coupon.repository.interface';
import { PrismaCouponRepository } from './infrastructure/prisma-coupon.repository';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [CouponController],
  providers: [
    CouponService,
    {
      provide: ICouponRepository,
      useClass: PrismaCouponRepository,
    },
  ],
  exports: [CouponService, ICouponRepository],
})
export class CouponModule {}
