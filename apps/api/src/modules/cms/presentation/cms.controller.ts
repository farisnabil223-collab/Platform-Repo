import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CmsService } from '../application/cms.service';

@ApiTags('Cms')
@Controller('cms')
export class CmsController {
  constructor(private readonly service: CmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get cms base status' })
  async getStatus() {
    return {
      module: 'cms',
      status: 'Active',
    };
  }
}
