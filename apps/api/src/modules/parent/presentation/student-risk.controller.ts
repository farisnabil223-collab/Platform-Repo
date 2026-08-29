import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateInterventionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notes!: string;
}

import { Inject } from '@nestjs/common';
import { IRiskScoringProvider, ISuccessScoringProvider } from '../domain/scoring-providers.interface';

@ApiTags('Student Risk & Intervention Engine')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('parent/student-risk')
export class StudentRiskController {
  constructor(
    @Inject(IRiskScoringProvider) private readonly riskEngine: IRiskScoringProvider,
    @Inject(ISuccessScoringProvider) private readonly successEngine: ISuccessScoringProvider
  ) {}

  @Get('student-risk')
  @ApiOperation({ summary: 'Calculate risk scores' })
  async getRiskScore(@Query('studentId') studentId: string) {
    const risk = await this.riskEngine.calculateRisk(studentId);
    const score = await this.successEngine.calculateSuccessScore(studentId);
    return { success: true, data: { risk, score } };
  }

  @Post('interventions')
  @ApiOperation({ summary: 'Trigger intervention plan for student' })
  async createIntervention(@Body() dto: CreateInterventionDto) {
    const plan = await prisma.interventionPlan.create({
      data: {
        id: generateUuidV7(),
        tenantId: 'default-tenant-uuid',
        studentId: dto.studentId,
        assignedTo: generateUuidV7(),
        description: dto.notes,
        slaDeadline: new Date(),
        status: 'ACTIVE',
      },
    });

    return { success: true, data: plan };
  }
}
