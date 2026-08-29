import { Module } from '@nestjs/common';
import { AlumniController } from './presentation/alumni-v1.controller';

@Module({
  controllers: [AlumniController],
  providers: [],
  exports: [],
})
export class AlumniModule {}
