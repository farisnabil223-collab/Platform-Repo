import { Module } from '@nestjs/common';
import { IntegrationsController } from './presentation/integrations-v1.controller';

@Module({
  controllers: [IntegrationsController],
  providers: [],
  exports: [],
})
export class IntegrationsModule {}
