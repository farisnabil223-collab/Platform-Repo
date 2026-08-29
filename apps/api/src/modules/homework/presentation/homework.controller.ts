import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HomeworkService } from '../application/homework.service';

@ApiTags('Homework')
@Controller('homework')
export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  @Get()
  @ApiOperation({ summary: 'Get homework base status' })
  async getStatus() {
    return {
      module: 'homework',
      status: 'Active',
    };
  }
}
