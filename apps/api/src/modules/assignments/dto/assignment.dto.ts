import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Term Project Essay' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Write a 1500 word essay about calculus.', required: false })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({ example: 100.0 })
  maxScore!: number;

  @ApiProperty({ example: '2026-09-30T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: '{}', required: false })
  @IsOptional()
  rubric?: string;

  @ApiProperty({ example: '{}', required: false })
  @IsOptional()
  gradingCriteria?: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  maxAttempts!: number;

  @ApiProperty({ example: '{}', required: false })
  @IsOptional()
  lateSubmissionPolicy?: string;
}

export class SubmitAssignmentDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({ example: ['submissions/essay.pdf'] })
  attachments!: string[];
}

export class GradeSubmissionDto {
  @ApiProperty({ example: 95.0 })
  score!: number;

  @ApiProperty({ example: 'teacher-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  gradedBy!: string;

  @ApiProperty({ example: 'Great work!', required: false })
  @IsOptional()
  @IsString()
  feedback?: string;
}
