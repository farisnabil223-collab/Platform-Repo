import { Module } from '@nestjs/common';
import { ExamsController } from './presentation/exams.controller';
import { ExamsService } from './application/exams.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
