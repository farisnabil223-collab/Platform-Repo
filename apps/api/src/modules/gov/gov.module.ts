import { Module } from '@nestjs/common';
import { GovController } from './presentation/gov-v1.controller';

@Module({
  controllers: [GovController],
  providers: [],
  exports: [],
})
export class GovModule {}
