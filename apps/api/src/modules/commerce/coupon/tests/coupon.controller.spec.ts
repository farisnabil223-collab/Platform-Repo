import { Test, TestingModule } from '@nestjs/testing';
import { CouponController } from '../presentation/coupon.controller';
import { CouponService } from '../application/coupon.service';
import { CartService } from '../../cart/application/cart.service';

describe('CouponController', () => {
  let controller: CouponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponController],
      providers: [
        {
          provide: CouponService,
          useValue: {
            validateCoupon: jest.fn().mockResolvedValue({ valid: true }),
            createCoupon: jest.fn().mockResolvedValue({}),
            getCoupons: jest.fn().mockResolvedValue({ items: [], total: 0 }),
            deleteCoupon: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CartService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CouponController>(CouponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
