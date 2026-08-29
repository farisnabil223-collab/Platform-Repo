import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';

export class HeartbeatDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @ApiProperty({ example: 120, description: 'Seconds offset offset in playback' })
  @IsInt()
  secondsOffset!: number;
}

export class BookmarkDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @ApiProperty({ example: 180, description: 'Playback offset' })
  @IsInt()
  secondsOffset!: number;

  @ApiProperty({ example: 'Important theorem definition', required: false })
  @IsOptional()
  @IsString()
  noteText?: string;
}

export class CompleteLessonDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;
}
