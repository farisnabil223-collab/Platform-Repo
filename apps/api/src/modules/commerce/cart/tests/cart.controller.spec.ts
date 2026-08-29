import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../presentation/cart.controller';
import { CartService } from '../application/cart.service';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            getOrCreateCart: jest.fn().mockResolvedValue({ items: [] }),
            addItemToCart: jest.fn().mockResolvedValue({}),
            removeItemFromCart: jest.fn().mockResolvedValue({}),
            updateItemQuantity: jest.fn().mockResolvedValue({}),
            calculateCartTotals: jest.fn().mockResolvedValue({ subtotal: 0, discount: 0, tax: 0, total: 0 }),
            clearCart: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
