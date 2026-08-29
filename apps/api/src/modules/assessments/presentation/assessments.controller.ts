import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateAssessmentHandler } from '../application/commands/create-assessment.handler';
import { StartAttemptHandler } from '../application/commands/start-attempt.handler';
import { SaveAnswerHandler } from '../application/commands/save-answer.handler';
import { SubmitAttemptHandler } from '../application/commands/submit-attempt.handler';
import { GradeReviewHandler } from '../application/commands/grade-review.handler';
import { CreateAppealHandler } from '../application/commands/create-appeal.handler';
import {
  CreateAssessmentDto,
  StartAttemptDto,
  SaveAnswerDto,
  SubmitAttemptDto,
  ProctorEventDto,
  ManualGradeDto,
  AppealResultDto
} from '../dto/assessment.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Assessments & Examinations')
@Controller('assessments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AssessmentsController {
  constructor(
    private readonly createAssessmentHandler: CreateAssessmentHandler,
    private readonly startAttemptHandler: StartAttemptHandler,
    private readonly saveAnswerHandler: SaveAnswerHandler,
    private readonly submitAttemptHandler: SubmitAttemptHandler,
    private readonly gradeReviewHandler: GradeReviewHandler,
    private readonly createAppealHandler: CreateAppealHandler
  ) {}

  @Post()
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new Assessment mapping blueprints and question configurations' })
  async createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.createAssessmentHandler.execute(dto);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Initiate a new student attempt with immutable snapshot lock' })
  async startAttempt(@Param('id') id: string, @Body() dto: StartAttemptDto) {
    return this.startAttemptHandler.execute(id, dto);
  }

  @Put('attempts/:id/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autosave response updates into structured QuestionAnswer records' })
  async saveAnswer(@Param('id') id: string, @Body() dto: SaveAnswerDto) {
    await this.saveAnswerHandler.execute(id, dto);
    return { success: true };
  }

  @Post('attempts/:id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit attempt responses and execute auto-grading engine evaluation rules' })
  async submitAttempt(@Param('id') id: string) {
    return this.submitAttemptHandler.execute(id);
  }

  @Post('attempts/:id/proctor/event')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log tab switches, browser focus loss, and camera face warnings' })
  async logProctorEvent(@Param('id') id: string, @Body() dto: ProctorEventDto) {
    if (dto.eventType === 'TAB_SWITCHED') {
      await prisma.assessmentAttempt.update({
        where: { id },
        data: {
          tabSwitchCount: { increment: 1 },
          isFlagged: true,
          flaggedReason: dto.details,
        },
      });
    }
    return { success: true };
  }

  @Post('submissions/:submissionId/grade')
  @HttpCode(HttpStatus.OK)
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Provide teacher manual scores and feedback' })
  async manualGrade(
    @Param('submissionId') submissionId: string,
    @Body() dto: ManualGradeDto
  ) {
    return this.gradeReviewHandler.execute(submissionId, dto);
  }

  @Post('results/:id/appeal')
  @ApiOperation({ summary: 'Submit appeal review on scored objective results' })
  async appealResult(@Param('id') id: string, @Body() dto: AppealResultDto) {
    return this.createAppealHandler.execute(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Query assessments with filtering, sorting, and cursor pagination' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'cursor', required: false, description: 'Cursor ID for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
  async queryAssessments(
    @Query('type') type?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder = 'desc'
  ) {
    const l = Math.max(1, parseInt(limit));
    const where: any = { deletedAt: null };
    if (type) {
      where.type = type;
    }

    const takeValue = l + 1;
    const queryParams: any = {
      take: takeValue,
      where,
      orderBy: { [sortBy]: sortOrder },
    };

    if (cursor) {
      queryParams.cursor = { id: cursor };
      queryParams.skip = 1;
    }

    const items = await prisma.assessment.findMany(queryParams);
    const hasNextPage = items.length > l;
    const resultItems = hasNextPage ? items.slice(0, l) : items;
    const nextCursor = hasNextPage ? resultItems[resultItems.length - 1].id : null;

    return {
      items: resultItems,
      nextCursor,
    };
  }
}
