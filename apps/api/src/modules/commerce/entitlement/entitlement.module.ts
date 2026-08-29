import { Module } from '@nestjs/common';
import { EntitlementController } from './presentation/entitlement.controller';
import { EntitlementService } from './application/entitlement.service';
import { IEntitlementRepository } from './domain/entitlement.repository.interface';
import { PrismaEntitlementRepository } from './infrastructure/prisma-entitlement.repository';

@Module({
  controllers: [EntitlementController],
  providers: [
    EntitlementService,
    {
      provide: IEntitlementRepository,
      useClass: PrismaEntitlementRepository,
    },
  ],
  exports: [EntitlementService, IEntitlementRepository],
})
export class EntitlementModule {}
