import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferStudentDto {
  @ApiProperty({ example: 'section-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  toSectionId!: string;
}
