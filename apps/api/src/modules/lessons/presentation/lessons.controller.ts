import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LessonsService } from '../application/lessons.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get lessons base status' })
  async getStatus() {
    return {
      module: 'lessons',
      status: 'Active',
    };
  }
}
