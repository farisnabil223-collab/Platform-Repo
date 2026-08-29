import { Module } from '@nestjs/common';
import { VideosController } from './presentation/videos.controller';
import { VideosService } from './application/videos.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
