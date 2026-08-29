import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignSubjectDto {
  @ApiProperty({ example: 'subject-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  subjectId!: string;
}
