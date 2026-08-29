import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CertificationService } from '../application/certification.service';
import { IsString, IsNotEmpty } from 'class-validator';

class IssueCertificateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId!: string;
}

@ApiTags('Academic Certifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/certificates')
export class CertificatesController {
  constructor(private readonly certService: CertificationService) {}

  @Post('issue')
  @ApiOperation({ summary: 'Enqueue a student certificate issuance' })
  async issue(@Body() dto: IssueCertificateDto) {
    const job = await this.certService.enqueueIssuance(dto.studentId, dto.courseId);
    return { success: true, data: job };
  }

  @Get('verify/:code')
  @ApiOperation({ summary: 'Verify public certificate validity code' })
  async verify(@Param('code') code: string) {
    const cert = await this.certService.verifyCertificate(code);
    return { success: true, verified: !!cert, data: cert };
  }
}
