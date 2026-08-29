import { Body, Controller, Get, Param, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { AssignTeacherSubjectHandler } from '../application/commands/assign-teacher-subject.handler';
import { AssignSubjectDto } from '../dto/assign-subject.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Teachers & Academic Profiles')
@Controller('teachers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly assignTeacherSubjectHandler: AssignTeacherSubjectHandler) {}

  @Post(':id/subjects')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Assign an academic Subject to a Teacher (Admin only)' })
  async assignSubject(@Param('id') id: string, @Body() dto: AssignSubjectDto) {
    await this.assignTeacherSubjectHandler.execute(id, dto);
    return { success: true };
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter teacher profiles with sorting and pagination' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'teacherCode' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc' })
  async queryTeachers(
    @Query('specialty') specialty?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'teacherCode',
    @Query('sortOrder') sortOrder = 'asc'
  ) {
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, parseInt(limit));
    const skip = (p - 1) * l;

    const where: any = { deletedAt: null };
    if (specialty) {
      where.specialties = { has: specialty };
    }
    if (search) {
      where.OR = [
        { teacherCode: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: l,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { email: true, phone: true } },
        },
      }),
      prisma.teacher.count({ where }),
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

  @Get(':id/subjects')
  @ApiOperation({ summary: 'Retrieve subjects mapped to a teacher' })
  async getSubjects(@Param('id') id: string) {
    return prisma.teacherSubject.findMany({
      where: { teacherId: id },
      include: { subject: { include: { grade: true } } },
    });
  }
}
