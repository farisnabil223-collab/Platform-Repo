import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @ApiProperty({ example: 'student-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({ example: 'academic-year-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  academicYearId!: string;

  @ApiProperty({ example: 'section-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  sectionId!: string;
}
