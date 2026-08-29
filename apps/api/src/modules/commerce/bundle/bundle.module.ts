import { Module } from '@nestjs/common';
import { BundleController } from './presentation/bundle.controller';
import { BundleService } from './application/bundle.service';

@Module({
  controllers: [BundleController],
  providers: [BundleService],
  exports: [BundleService],
})
export class BundleModule {}
