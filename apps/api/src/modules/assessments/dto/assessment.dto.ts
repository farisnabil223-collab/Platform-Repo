import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';

export class BlueprintTopicDto {
  @ApiProperty({ example: 'Algebra' })
  @IsNotEmpty()
  @IsString()
  topicName!: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  count!: number;
}

export class BlueprintDifficultyDto {
  @ApiProperty({ example: 'MEDIUM' })
  @IsNotEmpty()
  @IsString()
  difficulty!: string;

  @ApiProperty({ example: 0.5, description: 'Percentage split' })
  @IsNumber()
  ratio!: number;
}

export class CreateAssessmentDto {
  @ApiProperty({ example: 'ASM_MATH_101' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Calculus Final Exam' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'EXAM' })
  @IsNotEmpty()
  @IsString()
  type!: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  maxScore!: number;

  @ApiProperty({ example: 70.0 })
  @IsNumber()
  passingScore!: number;

  @ApiProperty({ example: 7200 })
  @IsInt()
  durationSeconds!: number;

  @ApiProperty({ type: [BlueprintTopicDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlueprintTopicDto)
  blueprintTopics?: BlueprintTopicDto[];

  @ApiProperty({ type: [BlueprintDifficultyDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlueprintDifficultyDto)
  blueprintDifficulties?: BlueprintDifficultyDto[];

  @ApiProperty({ example: 42, required: false })
  @IsOptional()
  @IsInt()
  randomSeed?: number;
}

export class StartAttemptDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;
}

export class SaveAnswerDto {
  @ApiProperty({ example: 'question-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  questionId!: string;

  @ApiProperty({ example: 'Writing response essay...', required: false })
  @IsOptional()
  @IsString()
  textResponse?: string;

  @ApiProperty({ example: ['choice-uuid-v7'], required: false })
  @IsOptional()
  @IsArray()
  selectedChoices?: string[];
}

export class SubmitAttemptDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;
}

export class ProctorEventDto {
  @ApiProperty({ example: 'TAB_SWITCHED' })
  @IsNotEmpty()
  @IsString()
  eventType!: string;

  @ApiProperty({ example: 'Student lost browser focus' })
  @IsNotEmpty()
  @IsString()
  details!: string;
}

export class ManualGradeDto {
  @ApiProperty({ example: 'question-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  questionId!: string;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  points!: number;

  @ApiProperty({ example: 'Good step derivation.', required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ example: 'teacher-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  gradedBy!: string;
}

export class AppealResultDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @ApiProperty({ example: 'Please review step 3, partial marks should apply.' })
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
