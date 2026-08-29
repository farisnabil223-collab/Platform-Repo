import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsBoolean, ValidateNested, ArrayMinSize } from 'class-validator';

export class ChoiceDto {
  @ApiProperty({ example: 'True' })
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect!: boolean;
}

export class QuestionDto {
  @ApiProperty({ example: 'Is 2+2=4?' })
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiProperty({ example: 'SINGLE_CHOICE', description: 'SINGLE_CHOICE, MULTIPLE_CHOICE, FREE_TEXT' })
  @IsNotEmpty()
  @IsString()
  type!: string;

  @ApiProperty({ type: [ChoiceDto] })
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  @ArrayMinSize(2)
  choices!: ChoiceDto[];
}

export class CreateQuizDto {
  @ApiProperty({ example: 'Math Addition Basics Quiz' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 70.0, description: 'Passing score percentage' })
  passingScore!: number;

  @ApiProperty({ example: 600, description: 'Time limit in seconds' })
  @IsInt()
  timeLimitSeconds!: number;

  @ApiProperty({ type: [QuestionDto] })
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ArrayMinSize(1)
  questions!: QuestionDto[];
}

export class QuizAttemptDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @ApiProperty({ example: '{}', description: 'Map of questionId to selected choiceIds' })
  answers!: Record<string, string[]>;
}
