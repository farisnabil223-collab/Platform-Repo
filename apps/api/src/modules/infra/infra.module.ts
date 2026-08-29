import { Module } from '@nestjs/common';
import { InfraController } from './presentation/infra-v1.controller';
import { OutboxProcessorService } from './application/outbox-processor.service';
import { BackgroundJobService } from './application/background-job.service';
import { StorageService } from './application/storage.service';
import { FeatureFlagService } from './application/feature-flag.service';

@Module({
  controllers: [InfraController],
  providers: [
    OutboxProcessorService,
    BackgroundJobService,
    StorageService,
    FeatureFlagService,
  ],
  exports: [
    OutboxProcessorService,
    BackgroundJobService,
    StorageService,
    FeatureFlagService,
  ],
})
export class InfraModule {}
