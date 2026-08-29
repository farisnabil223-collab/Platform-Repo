import { Module } from '@nestjs/common';
import { CartController } from './presentation/cart.controller';
import { CartService } from './application/cart.service';
import { ICartRepository } from './domain/cart.repository.interface';
import { PrismaCartRepository } from './infrastructure/prisma-cart.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: ICartRepository,
      useClass: PrismaCartRepository,
    },
  ],
  exports: [CartService, ICartRepository],
})
export class CartModule {}
