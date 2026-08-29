import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'student@eduverse.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty({ example: 'device-fingerprint-xyz123', description: 'Unique device hash/fingerprint' })
  @IsNotEmpty()
  @IsString()
  deviceHash!: string;

  @ApiProperty({ example: 'My Laptop', required: false })
  @IsOptional()
  @IsString()
  deviceName?: string;

  @ApiProperty({ example: 'Chrome', required: false })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiProperty({ example: 'macOS', required: false })
  @IsOptional()
  @IsString()
  os?: string;
}
