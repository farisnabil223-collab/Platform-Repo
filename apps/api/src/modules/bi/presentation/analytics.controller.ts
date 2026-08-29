import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { AnalyticsQueryEngine, QueryOptions } from '../domain/analytics-query-engine.service';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

class AnalyticsQueryDto {
  @ApiProperty()
  @IsArray()
  metrics!: string[];

  @ApiProperty()
  @IsArray()
  dimensions!: string[];

  @ApiProperty()
  @IsOptional()
  filters?: Record<string, any>;
}

class DrilldownDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  parentKey!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  childKey!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ApiTags('Business Intelligence Analytics Engine')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly queryEngine: AnalyticsQueryEngine) {}

  @Post('query')
  @ApiOperation({ summary: 'Execute BI query aggregation' })
  async executeQuery(@Body() dto: AnalyticsQueryDto) {
    const list = await this.queryEngine.executeQuery(dto);
    return { success: true, data: list };
  }

  @Post('drilldown')
  @ApiOperation({ summary: 'Drill down dynamically into dataset node details' })
  async drilldown(@Body() dto: DrilldownDto) {
    const list = await this.queryEngine.resolveDrilldown(dto.parentKey, dto.childKey, dto.id);
    return { success: true, data: list };
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Get list of calculated KPI definitions' })
  async getKpis() {
    const list = await prisma.kpiDefinition.findMany({
      include: { snapshots: true },
    });
    return { success: true, data: list };
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get benchmark comparison sets' })
  async getBenchmarks() {
    const list = await prisma.benchmarkDefinition.findMany({
      include: { results: true },
    });
    return { success: true, data: list };
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get executive analytical insights notifications' })
  async getInsights() {
    const list = await prisma.executiveInsight.findMany();
    return { success: true, data: list };
  }
}
