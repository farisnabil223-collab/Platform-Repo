import { Module } from '@nestjs/common';
import { OrderStudentController } from './presentation/order-student.controller';
import { OrderAdminController } from './presentation/order-admin.controller';
import { OrderService } from './application/order.service';
import { IOrderRepository } from './domain/order.repository.interface';
import { PrismaOrderRepository } from './infrastructure/prisma-order.repository';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [CartModule, ProductModule],
  controllers: [OrderStudentController, OrderAdminController],
  providers: [
    OrderService,
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [OrderService, IOrderRepository],
})
export class OrderModule {}
