import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { DiagnosticsService } from '../diagnostics/diagnostics.service';
import { IsString, IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

class CrashLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  appVersion!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stackTrace!: string;

  @ApiProperty()
  @IsOptional()
  metadata?: any;
}

class PerformanceMetricDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  metricType!: string;

  @ApiProperty()
  @IsNumber()
  value!: number;
}

class HeartbeatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsNumber()
  batteryLevel!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  networkType!: string;

  @ApiProperty()
  @IsNumber()
  availableStorage!: number;
}

@ApiTags('Mobile Diagnostics & Vitals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/diagnostics')
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Post('crash')
  @ApiOperation({ summary: 'Submit mobile application crash log trace' })
  async submitCrash(@Body() dto: CrashLogDto) {
    const log = await this.diagnosticsService.logCrash(dto);
    return { success: true, data: log };
  }

  @Post('performance')
  @ApiOperation({ summary: 'Log client performance metrics' })
  async logPerformance(@Body() dto: PerformanceMetricDto) {
    const metric = await this.diagnosticsService.logPerformanceMetric(dto.deviceId, dto.metricType, dto.value);
    return { success: true, data: metric };
  }

  @Post('heartbeat')
  @ApiOperation({ summary: 'Send device heartbeat vital signs' })
  async sendHeartbeat(@Body() dto: HeartbeatDto) {
    const heartbeat = await prisma.deviceHeartbeat.create({
      data: {
        id: generateUuidV7(),
        deviceId: dto.deviceId,
        batteryLevel: dto.batteryLevel,
        networkType: dto.networkType,
        availableStorage: dto.availableStorage,
      },
    });
    return { success: true, data: heartbeat };
  }
}
