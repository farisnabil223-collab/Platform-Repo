import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'signed-verification-token-string' })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
