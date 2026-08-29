import { Module } from '@nestjs/common';
import { AcademicIntelController } from './presentation/academic-intel-v1.controller';

@Module({
  controllers: [AcademicIntelController],
  providers: [],
  exports: [],
})
export class AcademicIntelModule {}
