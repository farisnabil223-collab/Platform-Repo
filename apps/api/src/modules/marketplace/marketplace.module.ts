import { Module } from '@nestjs/common';
import { MarketplaceController } from './presentation/marketplace-v1.controller';

@Module({
  controllers: [MarketplaceController],
  providers: [],
  exports: [],
})
export class MarketplaceModule {}
