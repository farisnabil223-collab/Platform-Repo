import { Body, Controller, Get, Param, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateGradeHandler } from '../application/commands/create-grade.handler';
import { CreateSubjectHandler } from '../application/commands/create-subject.handler';
import { CreateClassroomHandler } from '../application/commands/create-classroom.handler';
import { CreateSectionHandler } from '../application/commands/create-section.handler';
import { CreateAcademicYearHandler } from '../application/commands/create-academic-year.handler';
import { TransitionYearHandler } from '../application/commands/transition-year.handler';
import { CreateGradeDto } from '../dto/grade.dto';
import { CreateSubjectDto } from '../dto/subject.dto';
import { CreateClassroomDto } from '../dto/classroom.dto';
import { CreateSectionDto } from '../dto/section.dto';
import { CreateAcademicYearDto, TransitionYearDto } from '../dto/academic-year.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Academic Foundation')
@Controller('academic')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AcademicController {
  constructor(
    private readonly createGradeHandler: CreateGradeHandler,
    private readonly createSubjectHandler: CreateSubjectHandler,
    private readonly createClassroomHandler: CreateClassroomHandler,
    private readonly createSectionHandler: CreateSectionHandler,
    private readonly createAcademicYearHandler: CreateAcademicYearHandler,
    private readonly transitionYearHandler: TransitionYearHandler
  ) {}

  @Post('grades')
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new Academic Grade (Admin only)' })
  async createGrade(@Body() dto: CreateGradeDto) {
    return this.createGradeHandler.execute(dto);
  }

  @Post('subjects')
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new Subject mapping (Admin only)' })
  async createSubject(@Body() dto: CreateSubjectDto) {
    return this.createSubjectHandler.execute(dto);
  }

  @Post('classrooms')
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new physical Classroom (Admin only)' })
  async createClassroom(@Body() dto: CreateClassroomDto) {
    return this.createClassroomHandler.execute(dto);
  }

  @Post('sections')
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new class Section (Admin only)' })
  async createSection(@Body() dto: CreateSectionDto) {
    return this.createSectionHandler.execute(dto);
  }

  @Post('years')
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new Academic Year draft (Admin only)' })
  async createYear(@Body() dto: CreateAcademicYearDto) {
    return this.createAcademicYearHandler.execute(dto);
  }

  @Post('years/:id/transition')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Transition Academic Year lifecycle state (Admin only)' })
  async transitionYear(@Param('id') id: string, @Body() dto: TransitionYearDto) {
    await this.transitionYearHandler.execute(id, dto);
    return { success: true };
  }

  @Get('subjects')
  @ApiOperation({ summary: 'Query subjects with filtering, sorting and pagination' })
  @ApiQuery({ name: 'gradeId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'code' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc' })
  async getSubjects(
    @Query('gradeId') gradeId?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'code',
    @Query('sortOrder') sortOrder = 'asc'
  ) {
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, parseInt(limit));
    const skip = (p - 1) * l;

    const where: any = { deletedAt: null };
    if (gradeId) {
      where.gradeId = gradeId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: l,
        orderBy: { [sortBy]: sortOrder },
        include: { grade: true },
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l),
      },
    };
  }

  @Get('grades')
  @ApiOperation({ summary: 'List all active Academic Grades' })
  async getGrades() {
    return prisma.grade.findMany({ where: { deletedAt: null } });
  }

  @Get('years')
  @ApiOperation({ summary: 'List all Academic Years' })
  async getYears() {
    return prisma.academicYear.findMany({
      where: { deletedAt: null },
      include: { terms: true },
    });
  }
}
