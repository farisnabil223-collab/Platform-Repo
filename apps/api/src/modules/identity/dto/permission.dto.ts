import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'COURSE_CREATE' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Permission to create courses', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
