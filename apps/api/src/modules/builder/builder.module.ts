import { Module } from '@nestjs/common';
import { BuilderController } from './presentation/builder-v1.controller';

@Module({
  controllers: [BuilderController],
  providers: [],
  exports: [],
})
export class BuilderModule {}
