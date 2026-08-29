import { Module } from '@nestjs/common';
import { DataController } from './presentation/data-v1.controller';

@Module({
  controllers: [DataController],
  providers: [],
  exports: [],
})
export class DataModule {}
