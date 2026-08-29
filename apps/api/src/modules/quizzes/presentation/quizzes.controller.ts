import { Body, Controller, Get, Param, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateQuizHandler } from '../application/commands/create-quiz.handler';
import { SubmitQuizAttemptHandler } from '../application/commands/submit-quiz-attempt.handler';
import { CreateQuizDto, QuizAttemptDto } from '../dto/quiz.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Quizzes & Assessments')
@Controller('quizzes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class QuizzesController {
  constructor(
    private readonly createQuizHandler: CreateQuizHandler,
    private readonly submitQuizAttemptHandler: SubmitQuizAttemptHandler
  ) {}

  @Post()
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new Quiz mapping question options' })
  async createQuiz(@Body() dto: CreateQuizDto) {
    return this.createQuizHandler.execute(dto);
  }

  @Post(':id/attempt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit an attempt to answer a Quiz' })
  async submitAttempt(@Param('id') id: string, @Body() dto: QuizAttemptDto) {
    return this.submitQuizAttemptHandler.execute(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve quiz details with question nodes' })
  async getQuiz(@Param('id') id: string) {
    return prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            question: {
              include: { choices: true },
            },
          },
        },
      },
    });
  }
}
