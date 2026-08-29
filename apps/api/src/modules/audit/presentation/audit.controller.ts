import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditService } from '../application/audit.service';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit base status' })
  async getStatus() {
    return {
      module: 'audit',
      status: 'Active',
    };
  }
}
