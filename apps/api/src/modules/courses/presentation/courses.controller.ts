import { Body, Controller, Get, Param, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateCourseHandler } from '../application/commands/create-course.handler';
import { CreateModuleHandler } from '../application/commands/create-module.handler';
import { CreateLessonHandler } from '../application/commands/create-lesson.handler';
import { CreateLearningContentHandler } from '../application/commands/create-learning-content.handler';
import { PublishCourseHandler } from '../application/commands/publish-course.handler';
import { ArchiveCourseHandler } from '../application/commands/archive-course.handler';
import { CreateCourseDto, CreateModuleDto, CreateLessonDto, CreateContentDto } from '../dto/course.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Courses & Learning Structure')
@Controller('courses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(
    private readonly createCourseHandler: CreateCourseHandler,
    private readonly createModuleHandler: CreateModuleHandler,
    private readonly createLessonHandler: CreateLessonHandler,
    private readonly createLearningContentHandler: CreateLearningContentHandler,
    private readonly publishCourseHandler: PublishCourseHandler,
    private readonly archiveCourseHandler: ArchiveCourseHandler
  ) {}

  @Post()
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new course aggregate (Author only)' })
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.createCourseHandler.execute(dto);
  }

  @Post(':id/modules')
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new module inside a course' })
  async createModule(@Param('id') id: string, @Body() dto: CreateModuleDto) {
    return this.createModuleHandler.execute(id, dto);
  }

  @Post('modules/:id/lessons')
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new lesson inside a module' })
  async createLesson(@Param('id') id: string, @Body() dto: CreateLessonDto) {
    return this.createLessonHandler.execute(id, dto);
  }

  @Post('lessons/:id/contents')
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create polymorphic content inside a lesson' })
  async createContent(@Param('id') id: string, @Body() dto: CreateContentDto) {
    return this.createLearningContentHandler.execute(id, dto);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Publish a course and freeze its snapshot structure version' })
  async publishCourse(@Param('id') id: string, @Body('semver') semver: string) {
    await this.publishCourseHandler.execute(id, semver || '1.0.0');
    return { success: true };
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Archive a course aggregate' })
  async archiveCourse(@Param('id') id: string) {
    await this.archiveCourseHandler.execute(id);
    return { success: true };
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter courses with pagination' })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async queryCourses(
    @Query('teacherId') teacherId?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, parseInt(limit));
    const skip = (p - 1) * l;

    const where: any = { deletedAt: null };
    if (teacherId) {
      where.teacherId = teacherId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: l,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
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

  @Get(':id')
  @ApiOperation({ summary: 'Fetch detailed course outline structure' })
  async getCourseOutline(@Param('id') id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              include: {
                contents: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  }
}
