import { Body, Controller, Get, Param, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateAssignmentHandler } from '../application/commands/create-assignment.handler';
import { SubmitAssignmentHandler } from '../application/commands/submit-assignment.handler';
import { GradeAssignmentHandler } from '../application/commands/grade-assignment.handler';
import { CreateAssignmentDto, SubmitAssignmentDto, GradeSubmissionDto } from '../dto/assignment.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Assignments & Grading')
@Controller('assignments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(
    private readonly createAssignmentHandler: CreateAssignmentHandler,
    private readonly submitAssignmentHandler: SubmitAssignmentHandler,
    private readonly gradeAssignmentHandler: GradeAssignmentHandler
  ) {}

  @Post()
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new Assignment with grading rubrics' })
  async createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.createAssignmentHandler.execute(dto);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit an answer to an Assignment' })
  async submitAssignment(@Param('id') id: string, @Body() dto: SubmitAssignmentDto) {
    return this.submitAssignmentHandler.execute(id, dto);
  }

  @Post('submissions/:submissionId/grade')
  @HttpCode(HttpStatus.OK)
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Grade a student assignment submission' })
  async gradeSubmission(@Param('submissionId') submissionId: string, @Body() dto: GradeSubmissionDto) {
    return this.gradeAssignmentHandler.execute(submissionId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve assignment configuration outline' })
  async getAssignment(@Param('id') id: string) {
    return prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: {
          include: { grade: true },
        },
      },
    });
  }
}
