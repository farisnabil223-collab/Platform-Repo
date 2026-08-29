import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CalendarService } from '../calendar/calendar.service';
import { prisma } from '@eduverse/database';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  calendarId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @IsDateString()
  startAt!: string;

  @ApiProperty()
  @IsDateString()
  endAt!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  recurrenceRule?: string;
}

class RespondInvitationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  response!: 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
}

@ApiTags('Calendar Events & Recurrences')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  @ApiOperation({ summary: 'List all calendar events' })
  async getEvents(@Query('calendarId') calId: string) {
    const list = await prisma.calendarEvent.findMany({
      where: { calendarId: calId },
    });
    return { success: true, data: list };
  }

  @Post('events')
  @ApiOperation({ summary: 'Schedule a new calendar event' })
  async createEvent(@Body() dto: CreateEventDto) {
    const ev = await this.calendarService.createEvent({
      calendarId: dto.calendarId,
      title: dto.title,
      description: dto.description,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      recurrenceRule: dto.recurrenceRule,
    });
    return { success: true, data: ev };
  }

  @Post('respond')
  @ApiOperation({ summary: 'Respond to a calendar invitation' })
  async respond(@Body() dto: RespondInvitationDto) {
    const participant = await this.calendarService.respondInvitation(dto.eventId, dto.userId, dto.response);
    return { success: true, data: participant };
  }
}
