import { Controller, Get, Post, Body, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HealthService } from '../monitoring/health.service';
import { SecretManagerService } from '../security/secret-manager.service';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

class SaveSecretDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value!: string;
}

class RotateKeyDto {
  @ApiProperty()
  @IsNumber()
  version!: number;
}

@ApiTags('DevOps Platform & Observability')
@Controller('platform')
export class PlatformController {
  constructor(
    private readonly healthService: HealthService,
    private readonly secretService: SecretManagerService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Get infrastructure health status snap' })
  async getHealth() {
    await this.healthService.saveSnapshot(0.2, 0.45, 0.12, 15);
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      services: {
        database: 'UP',
        redis: 'UP',
        rabbitmq: 'UP',
      },
    };
  }

  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  @ApiOperation({ summary: 'Get Prometheus metrics endpoint' })
  async getMetrics() {
    return `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",handler="/health"} 1042
`;
  }

  @Get('incidents')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List active service incidents' })
  async getIncidents() {
    const list = await this.healthService.getIncidents();
    return { success: true, data: list };
  }

  @Post('secrets')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Save encrypted integration secret' })
  async saveSecret(@Body() dto: SaveSecretDto) {
    const secret = await this.secretService.saveSecret(dto.orgId, dto.provider, dto.value);
    return { success: true, data: secret };
  }

  @Post('rotate-key')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Rotate data encryption keys' })
  async rotateKey(@Body() dto: RotateKeyDto) {
    const key = await this.secretService.rotateKey(dto.version);
    return { success: true, data: key };
  }
}
