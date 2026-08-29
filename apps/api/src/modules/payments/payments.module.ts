import { Module } from '@nestjs/common';
import { PaymentsController } from './presentation/payments.controller';
import { PaymentsService } from './application/payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
