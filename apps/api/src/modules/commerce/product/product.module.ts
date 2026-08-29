import { Module } from '@nestjs/common';
import { ProductPublicController } from './presentation/product-public.controller';
import { ProductAdminController } from './presentation/product-admin.controller';
import { ProductService } from './application/product.service';
import { IProductRepository } from './domain/product.repository.interface';
import { PrismaProductRepository } from './infrastructure/prisma-product.repository';
import { ProductTargetResolver, IProductTargetResolverToken } from './application/product-target.resolver';

import { CatalogModule } from '../../catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  controllers: [ProductPublicController, ProductAdminController],
  providers: [
    ProductService,
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: IProductTargetResolverToken,
      useClass: ProductTargetResolver,
    },
  ],
  exports: [ProductService, IProductRepository, IProductTargetResolverToken],
})
export class ProductModule {}
