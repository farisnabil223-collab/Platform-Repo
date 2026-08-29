import { Module } from '@nestjs/common';
import { SubscriptionController } from './presentation/subscription.controller';
import { SubscriptionService } from './application/subscription.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
