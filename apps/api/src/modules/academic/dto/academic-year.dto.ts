import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from 'class-validator';

export class TermDto {
  @ApiProperty({ example: 'Term 1' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '2026-09-01T00:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2027-01-15T00:00:00Z' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  sortOrder!: number;
}

export class CreateAcademicYearDto {
  @ApiProperty({ example: '2026-2027' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '2026-09-01T00:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2027-06-30T00:00:00Z' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ type: [TermDto] })
  @ValidateNested({ each: true })
  @Type(() => TermDto)
  @ArrayMinSize(1)
  terms!: TermDto[];
}

export class TransitionYearDto {
  @ApiProperty({ example: 'ACTIVE', description: 'Draft, Upcoming, Active, Closed, Archived' })
  @IsNotEmpty()
  @IsString()
  status!: string;
}
