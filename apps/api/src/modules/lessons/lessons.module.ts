import { Module } from '@nestjs/common';
import { LessonsController } from './presentation/lessons.controller';
import { LessonsService } from './application/lessons.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
