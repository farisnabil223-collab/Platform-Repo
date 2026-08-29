import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExamEngineService } from '../application/exam-engine.service';
import { IsString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';

class ExamHeartbeatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attemptId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;
}

class ExamCheckpointDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attemptId!: string;

  @ApiProperty()
  @IsNumber()
  progress!: number;

  @ApiProperty()
  @IsObject()
  answers!: any;
}

class ExamResumeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attemptId!: string;
}

@ApiTags('Examination Runtime Engine')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/exams/runtime')
export class ExamRuntimeController {
  constructor(private readonly examService: ExamEngineService) {}

  @Post('heartbeat')
  @ApiOperation({ summary: 'Send exam heartbeat' })
  async heartbeat(@Body() dto: ExamHeartbeatDto) {
    const hb = await this.examService.sendHeartbeat(dto.attemptId, dto.deviceId);
    return { success: true, data: hb };
  }

  @Post('checkpoint')
  @ApiOperation({ summary: 'Save intermediate answers checkpoint' })
  async checkpoint(@Body() dto: ExamCheckpointDto) {
    const cp = await this.examService.saveCheckpoint(dto.attemptId, dto.progress, dto.answers);
    return { success: true, data: cp };
  }

  @Post('resume')
  @ApiOperation({ summary: 'Resume interrupted exam session' })
  async resume(@Body() dto: ExamResumeDto) {
    const cp = await this.examService.getLatestCheckpoint(dto.attemptId);
    return { success: true, data: cp };
  }
}
