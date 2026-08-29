import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class IngestMediaDto {
  @ApiProperty({ example: 'Introduction Lecture Video' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'R2', description: 'S3, R2, CLOUDFLARE_STREAM' })
  @IsNotEmpty()
  @IsString()
  storageProvider!: string;

  @ApiProperty({ example: 'uploads/math-intro.mp4' })
  @IsNotEmpty()
  @IsString()
  storagePath!: string;

  @ApiProperty({ example: 'VIDEO', description: 'VIDEO, IMAGE, SUBTITLE, SCORM, AUDIO' })
  @IsNotEmpty()
  @IsString()
  mediaType!: string;
}
