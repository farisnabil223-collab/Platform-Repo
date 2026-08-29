import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: 'student@eduverse.com' })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({ example: 'LOGIN', enum: ['LOGIN', 'PASSWORD_RESET', 'MFA'] })
  @IsNotEmpty()
  @IsString()
  purpose!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'student@eduverse.com' })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code!: string;

  @ApiProperty({ example: 'LOGIN' })
  @IsNotEmpty()
  @IsString()
  purpose!: string;
}
