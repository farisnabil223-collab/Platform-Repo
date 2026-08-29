import { Module } from '@nestjs/common';
import { HomeworkController } from './presentation/homework.controller';
import { HomeworkService } from './application/homework.service';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService],
  exports: [HomeworkService],
})
export class HomeworkModule {}
