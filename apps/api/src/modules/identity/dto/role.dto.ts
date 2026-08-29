import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'TEACHER' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Teacher system role description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
