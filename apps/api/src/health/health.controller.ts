import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { prisma } from '@eduverse/database';
import { CacheService } from '@eduverse/cache';
import { StorageService } from '@eduverse/storage';

@ApiTags('Health Monitoring')
@Controller('health')
export class HealthController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly storageService: StorageService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Uptime and base health status' })
  getHealth() {
    return {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check' })
  getLive() {
    return { status: 'ALIVE' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check of database, cache and storage' })
  async getReady() {
    const dbStatus = await this.checkDb();
    const redisStatus = await this.checkRedis();
    const storageStatus = await this.checkStorage();

    const isHealthy = dbStatus && redisStatus && storageStatus;

    if (!isHealthy) {
      throw new HttpException(
        {
          status: 'DOWN',
          checks: {
            database: dbStatus ? 'UP' : 'DOWN',
            redis: redisStatus ? 'UP' : 'DOWN',
            storage: storageStatus ? 'UP' : 'DOWN',
          },
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    return {
      status: 'READY',
      checks: {
        database: 'UP',
        redis: 'UP',
        storage: 'UP',
      },
    };
  }

  @Get('database')
  @ApiOperation({ summary: 'Deep database health check' })
  async getDatabaseHealth() {
    const isHealthy = await this.checkDb();
    if (!isHealthy) {
      throw new HttpException({ status: 'DOWN', service: 'database' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return { status: 'UP', service: 'database' };
  }

  @Get('redis')
  @ApiOperation({ summary: 'Deep Redis health check' })
  async getRedisHealth() {
    const isHealthy = await this.checkRedis();
    if (!isHealthy) {
      throw new HttpException({ status: 'DOWN', service: 'redis' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return { status: 'UP', service: 'redis' };
  }

  @Get('storage')
  @ApiOperation({ summary: 'Deep Storage connection health check' })
  async getStorageHealth() {
    const isHealthy = await this.checkStorage();
    if (!isHealthy) {
      throw new HttpException({ status: 'DOWN', service: 'storage' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return { status: 'UP', service: 'storage' };
  }

  private async checkDb(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      const client = this.cacheService.getClient();
      const pong = await client.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }

  private async checkStorage(): Promise<boolean> {
    try {
      // Test storage by uploading a small dummy buffer
      const testBuffer = Buffer.from('health-check-probe');
      const url = await this.storageService.upload('health-probe.txt', testBuffer, 'text/plain');
      return !!url;
    } catch {
      return false;
    }
  }
}
