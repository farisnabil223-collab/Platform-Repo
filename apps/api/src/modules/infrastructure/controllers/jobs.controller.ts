import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JobSchedulerService } from '../queue/job-scheduler.service';
import { prisma } from '@eduverse/database';
import { IsString, IsNotEmpty, IsObject, IsOptional, IsNumber } from 'class-validator';

class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  queue!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsObject()
  payload!: any;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priority?: number;
}

class RetryJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobId!: string;
}

@ApiTags('Background Job Worker')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobSchedulerService) {}

  @Get()
  @ApiOperation({ summary: 'List background jobs status' })
  async getJobs(@Query('queue') queue: string) {
    const list = await prisma.backgroundJob.findMany({
      where: queue ? { queue } : {},
      orderBy: { scheduledAt: 'desc' },
    });
    return { success: true, data: list };
  }

  @Post()
  @ApiOperation({ summary: 'Enqueue a new background job worker' })
  async createJob(@Body() dto: CreateJobDto) {
    const job = await this.jobService.queueJob(dto.queue, dto.name, dto.payload, dto.priority);
    return { success: true, data: job };
  }

  @Post('retry')
  @ApiOperation({ summary: 'Retry a failed worker job' })
  async retryJob(@Body() dto: RetryJobDto) {
    const job = await this.jobService.retryJob(dto.jobId);
    return { success: true, data: job };
  }
}
