import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray, IsEnum, IsDateString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 'Sprint 5 Planning Chat', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isGroup!: boolean;

  @ApiProperty({ example: ['user-uuid-1', 'user-uuid-2'] })
  @IsArray()
  members!: string[];
}

export class SendMessageDto {
  @ApiProperty({ example: 'Hello world!' })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({ example: ['/attachments/file.jpg'], required: false })
  @IsOptional()
  @IsArray()
  attachments?: string[];
}

export class PinMessageDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isPinned!: boolean;
}

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'ANN_2026_001' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Welcome back students' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Classes resume next week' })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({ example: 'SYSTEM' })
  @IsNotEmpty()
  @IsString()
  audienceType!: string;

  @ApiProperty({ example: 'university-uuid', required: false })
  @IsOptional()
  @IsString()
  audienceId?: string;

  @ApiProperty({ example: 'NORMAL' })
  @IsNotEmpty()
  @IsString()
  priority!: string;

  @ApiProperty({ example: '2026-09-01T08:00:00Z' })
  @IsDateString()
  publishAt!: string;

  @ApiProperty({ example: '2026-09-10T08:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  expireAt?: string;
}

export class ReportContentDto {
  @ApiProperty({ example: 'SPAM' })
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
