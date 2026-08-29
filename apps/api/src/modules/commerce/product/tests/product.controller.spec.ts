import { Test, TestingModule } from '@nestjs/testing';
import { ProductPublicController } from '../presentation/product-public.controller';
import { ProductAdminController } from '../presentation/product-admin.controller';
import { ProductService } from '../application/product.service';

describe('ProductControllers', () => {
  let publicController: ProductPublicController;
  let adminController: ProductAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPublicController, ProductAdminController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: jest.fn().mockResolvedValue({ items: [], total: 0 }),
            getProductBySlug: jest.fn().mockResolvedValue({}),
            getProductById: jest.fn().mockResolvedValue({}),
            createProduct: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    publicController = module.get<ProductPublicController>(ProductPublicController);
    adminController = module.get<ProductAdminController>(ProductAdminController);
  });

  it('should be defined', () => {
    expect(publicController).toBeDefined();
    expect(adminController).toBeDefined();
  });
});
