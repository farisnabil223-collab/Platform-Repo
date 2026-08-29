import { Module } from '@nestjs/common';
import { CmsController } from './presentation/cms.controller';
import { CmsService } from './application/cms.service';

@Module({
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
