import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { ReportGenerationService } from '../application/report-generation.service';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

class ExecuteReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reportId!: string;

  @ApiProperty()
  @IsObject()
  parameters!: Record<string, string>;
}

@ApiTags('Centralized Reports Builder')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportGenerationService) {}

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  async listReports() {
    const list = await prisma.report.findMany();
    return { success: true, data: list };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report config' })
  async getReport(@Param('id') id: string) {
    const report = await prisma.report.findUniqueOrThrow({
      where: { id },
    });
    return { success: true, data: report };
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute custom builder report' })
  async executeReport(@Body() dto: ExecuteReportDto) {
    const result = await this.reportService.executeReport(dto.reportId, dto.parameters);
    return { success: true, data: result };
  }
}
