import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ example: 'GRADE_1' })
  @IsNotEmpty()
  @IsString()
  level!: string;

  @ApiProperty({ example: 'First Grade' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Elementary grade 1 details', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
