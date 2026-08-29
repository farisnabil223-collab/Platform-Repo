import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LiveSessionService } from '../live/live-session.service';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

class StartLiveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provider!: string; // ZOOM, TEAMS

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingId!: string;
}

class EndLiveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId!: string;
}

class SaveRecordingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recordingUrl!: string;

  @ApiProperty()
  @IsNumber()
  duration!: number;
}

@ApiTags('Live Video Classroom')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveSessionService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a live Zoom/Teams lesson' })
  async start(@Body() dto: StartLiveDto) {
    const session = await this.liveService.startSession(dto.courseId, dto.provider, dto.meetingId);
    return { success: true, data: session };
  }

  @Post('end')
  @ApiOperation({ summary: 'End an active live streaming lesson' })
  async end(@Body() dto: EndLiveDto) {
    const session = await this.liveService.endSession(dto.sessionId);
    return { success: true, data: session };
  }

  @Post('recording')
  @ApiOperation({ summary: 'Save live lesson cloud recording url' })
  async recording(@Body() dto: SaveRecordingDto) {
    const rec = await this.liveService.addRecording(dto.sessionId, dto.recordingUrl, dto.duration);
    return { success: true, data: rec };
  }
}
