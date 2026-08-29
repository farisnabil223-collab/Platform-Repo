import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateIssuerDto {
  @ApiProperty({ example: 'Faculty of Computer Science' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'FAC_CS' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: { color: '#002244', logo: '/logos/fac_cs.png' } })
  @IsObject()
  branding!: Record<string, any>;

  @ApiProperty({ example: '-----BEGIN PUBLIC KEY-----...' })
  @IsNotEmpty()
  @IsString()
  publicKey!: string;

  @ApiProperty({ example: { manualApprovalRequired: true } })
  @IsObject()
  policies!: Record<string, any>;
}

export class CreateTemplateDto {
  @ApiProperty({ example: 'TMP_MATH_101' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Math 101 Completion Certificate' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: '<html><body>Congratulations {{name}}!</body></html>' })
  @IsNotEmpty()
  @IsString()
  htmlLayout!: string;

  @ApiProperty({ example: 'body { font-family: sans-serif; }', required: false })
  @IsOptional()
  @IsString()
  cssStyles?: string;

  @ApiProperty({ example: { name: 'string', date: 'string' } })
  @IsObject()
  variables!: Record<string, any>;
}

export class IssueCertificateDto {
  @ApiProperty({ example: 'student-uuid-1' })
  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @ApiProperty({ example: 'template-uuid-1' })
  @IsNotEmpty()
  @IsString()
  templateId!: string;

  @ApiProperty({ example: 'issuer-uuid-1' })
  @IsNotEmpty()
  @IsString()
  issuerId!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  recipientName!: string;

  @ApiProperty({ example: 'Advanced Calculus' })
  @IsNotEmpty()
  @IsString()
  programName!: string;

  @ApiProperty({ example: 98.5, required: false })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({ example: '2026-07-27T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class RevokeCertificateDto {
  @ApiProperty({ example: 'Cheating violation detected' })
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
