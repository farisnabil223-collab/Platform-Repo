import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { CacheModule } from '@eduverse/cache';
import { StorageModule } from '@eduverse/storage';

@Module({
  imports: [CacheModule, StorageModule],
  controllers: [HealthController],
})
export class HealthModule {}
