import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { GradebookService } from '../application/gradebook.service';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class CreateAssessmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxScore!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  passingScore!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  durationSeconds!: number;
}

class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  difficulty!: string; // EASY, MEDIUM, HARD

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;
}

class AdjustGradeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  adjustedScore!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

@ApiTags('Admin Assessment Platform')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminAssessmentController {
  constructor(private readonly gradebookService: GradebookService) {}

  @Post('assessments')
  @ApiOperation({ summary: 'Create new assessment blueprint' })
  async createAssessment(@Body() dto: CreateAssessmentDto) {
    const code = 'ASS-' + Math.floor(1000 + Math.random() * 9000);
    const assessment = await prisma.assessment.create({
      data: {
        id: generateUuidV7(),
        code,
        title: dto.title,
        type: dto.type,
        maxScore: dto.maxScore,
        passingScore: dto.passingScore,
        durationSeconds: dto.durationSeconds,
        settings: {},
      },
    });

    return { success: true, data: assessment };
  }

  @Post('questions')
  @ApiOperation({ summary: 'Create question bank question' })
  async createQuestion(@Body() dto: CreateQuestionDto) {
    const code = 'Q-' + Math.floor(10000 + Math.random() * 90000);
    const question = await prisma.question.create({
      data: {
        id: generateUuidV7(),
        code,
        type: dto.type as any,
        difficulty: dto.difficulty,
        text: dto.text,
      },
    });

    return { success: true, data: question };
  }

  @Post('results/:entryId/adjust')
  @ApiOperation({ summary: 'Adjust or override student grade entry' })
  async adjustGrade(@Param('entryId') entryId: string, @Body() dto: AdjustGradeDto, @Request() req: any) {
    const adjusted = await this.gradebookService.adjustGrade(
      entryId,
      dto.adjustedScore,
      req.user.id,
      dto.reason
    );
    return { success: true, data: adjusted };
  }

  @Get('gradebook')
  @ApiOperation({ summary: 'View aggregate gradebook records' })
  async getGradebooks() {
    const gradebooks = await prisma.gradebook.findMany({
      include: { entries: true },
    });
    return { success: true, data: gradebooks };
  }
}
