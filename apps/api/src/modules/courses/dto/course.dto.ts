import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsUUID, IsJSON } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'CRS_MATH_101' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'intro-to-math' })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'Introduction to Mathematics' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Algebra and arithmetic fundamentals', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'teacher-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  teacherId!: string;
}

export class CreateModuleDto {
  @ApiProperty({ example: 'MDL_MATH_BASIC' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Basic Arithmetic' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  sortOrder!: number;
}

export class CreateLessonDto {
  @ApiProperty({ example: 'LSN_MATH_ADD' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Addition and Subtraction' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  sortOrder!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  displayOrder!: number;

  @ApiProperty({ example: 600, description: 'Estimated duration in seconds' })
  @IsInt()
  estimatedDuration!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  isLocked!: boolean;

  @ApiProperty({ example: '{}', required: false })
  @IsOptional()
  unlockCondition?: string;
}

export class CreateContentDto {
  @ApiProperty({ example: 'VIDEO', description: 'VIDEO, PDF, ARTICLE, QUIZ, ASSIGNMENT, SCORM, AUDIO' })
  @IsNotEmpty()
  @IsString()
  contentType!: string;

  @ApiProperty({ example: 'Introduction Video' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  sortOrder!: number;

  @ApiProperty({ example: 'media-uuid-v7', required: false })
  @IsOptional()
  @IsUUID()
  mediaAssetId?: string;

  @ApiProperty({ example: 'quiz-uuid-v7', required: false })
  @IsOptional()
  @IsUUID()
  quizId?: string;

  @ApiProperty({ example: 'assignment-uuid-v7', required: false })
  @IsOptional()
  @IsUUID()
  assignmentId?: string;
}
