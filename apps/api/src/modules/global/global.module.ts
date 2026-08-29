import { Module } from '@nestjs/common';
import { GlobalController } from './presentation/global-v1.controller';

@Module({
  controllers: [GlobalController],
  providers: [],
  exports: [],
})
export class GlobalModule {}
