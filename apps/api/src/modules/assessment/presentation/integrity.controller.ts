import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IntegrityService } from '../application/integrity.service';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

class LogIncidentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attemptId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  incidentType!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  severity!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @ApiProperty()
  @IsObject()
  metadata!: any;
}

@ApiTags('Academic Integrity & Proctoring')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('integrity')
export class IntegrityController {
  constructor(private readonly integrityService: IntegrityService) {}

  @Post('incidents')
  @ApiOperation({ summary: 'Log a new proctor session incident' })
  async logIncident(@Body() dto: LogIncidentDto) {
    const inc = await this.integrityService.logIncident(
      dto.attemptId,
      dto.incidentType,
      dto.severity,
      dto.metadata,
    );
    return { success: true, data: inc };
  }

  @Get('report/:attemptId')
  @ApiOperation({ summary: 'Calculate integrity risk report for attempt' })
  async getReport(@Param('attemptId') id: string) {
    const report = await this.integrityService.calculateRisk(id);
    return { success: true, data: report };
  }
}
