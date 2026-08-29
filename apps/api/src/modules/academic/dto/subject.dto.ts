import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ example: 'MATH_101' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Introduction to Mathematics' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Basic algebra and calculus', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  creditHours!: number;

  @ApiProperty({ example: 4 })
  @IsInt()
  weeklyHours!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  isElective!: boolean;

  @ApiProperty({ example: 'grade-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  gradeId!: string;
}
