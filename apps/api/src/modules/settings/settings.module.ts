import { Module } from '@nestjs/common';
import { SettingsController } from './presentation/settings.controller';
import { SettingsService } from './application/settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
