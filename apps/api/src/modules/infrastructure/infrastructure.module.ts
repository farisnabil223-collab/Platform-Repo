import { Module } from '@nestjs/common';
import { PlatformController } from './controllers/platform.controller';
import { JobsController } from './controllers/jobs.controller';
import { StorageController } from './controllers/storage.controller';
import { ApiKeysController } from './controllers/api-keys.controller';
import { JobSchedulerService } from './queue/job-scheduler.service';
import { CacheService } from './cache/cache.service';
import { StorageService } from './storage/storage.service';
import { SecretManagerService } from './security/secret-manager.service';
import { HealthService } from './monitoring/health.service';
import { WebhookService } from './security/webhook.service';

import { InfraController } from '../infra/presentation/infra-v1.controller';
import { OutboxProcessorService } from '../infra/application/outbox-processor.service';
import { BackgroundJobService } from '../infra/application/background-job.service';
import { StorageService as InfraStorageService } from '../infra/application/storage.service';
import { FeatureFlagService } from '../infra/application/feature-flag.service';

@Module({
  controllers: [
    PlatformController,
    JobsController,
    StorageController,
    ApiKeysController,
    InfraController,
  ],
  providers: [
    JobSchedulerService,
    CacheService,
    StorageService,
    SecretManagerService,
    HealthService,
    WebhookService,
    OutboxProcessorService,
    BackgroundJobService,
    InfraStorageService,
    FeatureFlagService,
  ],
  exports: [
    JobSchedulerService,
    CacheService,
    StorageService,
    SecretManagerService,
    HealthService,
    WebhookService,
    OutboxProcessorService,
    BackgroundJobService,
    InfraStorageService,
    FeatureFlagService,
  ],
})
export class InfrastructureModule {}
