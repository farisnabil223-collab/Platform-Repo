import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({ example: 'Room 101' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'RM-101' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(1)
  capacity!: number;
}
