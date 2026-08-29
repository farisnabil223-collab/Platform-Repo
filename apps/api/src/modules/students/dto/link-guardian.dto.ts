import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LinkGuardianDto {
  @ApiProperty({ example: 'guardian-user-uuid-v7' })
  @IsUUID()
  @IsNotEmpty()
  guardianUserId!: string;

  @ApiProperty({ example: 'FATHER', description: 'FATHER, MOTHER, GUARDIAN' })
  @IsNotEmpty()
  @IsUUID()
  relation!: string;
}
