import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VideosService } from '../application/videos.service';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly service: VideosService) {}

  @Get()
  @ApiOperation({ summary: 'Get videos base status' })
  async getStatus() {
    return {
      module: 'videos',
      status: 'Active',
    };
  }
}
