import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'Section A' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'SEC-A' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'grade-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  gradeId!: string;

  @ApiProperty({ example: 'classroom-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  classroomId!: string;
}
