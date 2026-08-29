import { Module } from '@nestjs/common';
import { SubscriptionsController } from './presentation/subscriptions.controller';
import { SubscriptionsService } from './application/subscriptions.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
