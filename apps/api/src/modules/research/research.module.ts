import { Module } from '@nestjs/common';
import { ResearchController } from './presentation/research-v1.controller';

@Module({
  controllers: [ResearchController],
  providers: [],
  exports: [],
})
export class ResearchModule {}
