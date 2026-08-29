import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { AssessmentAttemptService } from '../application/assessment-attempt.service';
import { AssessmentScoringPipeline } from '../application/assessment-scoring.pipeline';
import { GradebookService } from '../application/gradebook.service';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class StartAttemptDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assessmentId!: string;
}

class SaveAnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @ApiProperty()
  @IsNotEmpty()
  answer!: any;
}

class CreateAppealDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  resultId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

class SubmitAssignmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attemptId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  fileSize!: number;
}

@ApiTags('Student Assessment Platform')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/assessments')
export class StudentAssessmentController {
  constructor(
    private readonly attemptService: AssessmentAttemptService,
    private readonly scoringPipeline: AssessmentScoringPipeline,
    private readonly gradebookService: GradebookService
  ) {}

  @Get('assessments')
  @ApiOperation({ summary: 'List student assessments' })
  async getAssessments(@Request() req: any) {
    const list = await prisma.assessment.findMany({
      where: { status: 'PUBLISHED' },
    });
    return { success: true, data: list };
  }

  @Post('attempts')
  @ApiOperation({ summary: 'Start a new assessment attempt' })
  async startAttempt(@Body() dto: StartAttemptDto, @Request() req: any) {
    const attempt = await this.attemptService.startAttempt(req.user.id, dto.assessmentId);
    return { success: true, data: attempt };
  }

  @Post('attempts/:id/save-answer')
  @ApiOperation({ summary: 'Auto-save answer response during attempt' })
  async saveAnswer(@Param('id') id: string, @Body() dto: SaveAnswerDto) {
    const data = await this.attemptService.autoSaveAnswer(id, dto.questionId, dto.answer);
    return { success: true, data };
  }

  @Post('attempts/:id/submit')
  @ApiOperation({ summary: 'Submit attempt for grading' })
  async submitAttempt(@Param('id') id: string) {
    const result = await this.scoringPipeline.scoreAttempt(id);
    return { success: true, data: result };
  }

  @Get('results')
  @ApiOperation({ summary: 'Get student results' })
  async getResults(@Request() req: any) {
    const results = await prisma.assessmentResult.findMany({
      where: { attempt: { student: { userId: req.user.id } } },
    });
    return { success: true, data: results };
  }

  @Post('assignments')
  @ApiOperation({ summary: 'Submit homework files' })
  async submitAssignment(@Body() dto: SubmitAssignmentDto) {
    const submission = await prisma.assignmentSubmissionWorkflow.create({
      data: {
        id: generateUuidV7(),
        attemptId: dto.attemptId,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
        status: 'SUBMITTED',
      },
    });

    return { success: true, data: submission };
  }

  @Get('gradebook')
  @ApiOperation({ summary: 'Get student gradebook entries' })
  async getGradebook(@Request() req: any) {
    const entries = await prisma.gradeEntry.findMany({
      where: { gradebook: { student: { userId: req.user.id } } },
    });
    return { success: true, data: entries };
  }

  @Post('gradebook/appeals')
  @ApiOperation({ summary: 'Submit grade appeal request' })
  async createAppeal(@Body() dto: CreateAppealDto, @Request() req: any) {
    const appeal = await this.gradebookService.createAppeal(req.user.id, dto.resultId, dto.reason);
    return { success: true, data: appeal };
  }
}
