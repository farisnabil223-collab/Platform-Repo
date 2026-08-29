import { Body, Controller, Get, Param, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { EnrollStudentHandler } from '../application/commands/enroll-student.handler';
import { TransferStudentSectionHandler } from '../application/commands/transfer-student-section.handler';
import { LinkGuardianHandler } from '../application/commands/link-guardian.handler';
import { EnrollStudentDto } from '../dto/enroll-student.dto';
import { TransferStudentDto } from '../dto/transfer-student.dto';
import { LinkGuardianDto } from '../dto/link-guardian.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Students & Guardian Profiles')
@Controller('students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(
    private readonly enrollStudentHandler: EnrollStudentHandler,
    private readonly transferStudentSectionHandler: TransferStudentSectionHandler,
    private readonly linkGuardianHandler: LinkGuardianHandler
  ) {}

  @Post('enroll')
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Enroll a student into an Academic Year (Admin only)' })
  async enrollStudent(@Body() dto: EnrollStudentDto) {
    return this.enrollStudentHandler.execute(dto);
  }

  @Post('enrollments/:enrollmentId/transfer')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Transfer student enrollment to another section (Admin only)' })
  async transferSection(@Param('enrollmentId') enrollmentId: string, @Body() dto: TransferStudentDto) {
    await this.transferStudentSectionHandler.execute(enrollmentId, dto);
    return { success: true };
  }

  @Post(':id/guardians')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Link a guardian profile to a student (Admin only)' })
  async linkGuardian(@Param('id') id: string, @Body() dto: LinkGuardianDto) {
    await this.linkGuardianHandler.execute(id, dto);
    return { success: true };
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter student profiles with sorting and pagination' })
  @ApiQuery({ name: 'gradeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'studentCode' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc' })
  async queryStudents(
    @Query('gradeId') gradeId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'studentCode',
    @Query('sortOrder') sortOrder = 'asc'
  ) {
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, parseInt(limit));
    const skip = (p - 1) * l;

    const where: any = { deletedAt: null };
    if (gradeId) {
      where.gradeId = gradeId;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { studentCode: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: l,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { email: true, phone: true } },
          grade: true,
        },
      }),
      prisma.student.count({ where }),
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

  @Get(':id/enrollments')
  @ApiOperation({ summary: 'Retrieve student historic academic enrollment details' })
  async getEnrollments(@Param('id') id: string) {
    return prisma.studentEnrollment.findMany({
      where: { studentId: id, deletedAt: null },
      include: { academicYear: true, section: true },
    });
  }
}
