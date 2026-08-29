import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CoursesPublicService } from '../application/courses-public.service';

@ApiTags('Public Courses')
@Controller('public/courses')
@Public() // custom public marker if any, or just empty guards
export class PublicCoursesController {
  constructor(private readonly coursesPublicService: CoursesPublicService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve public courses catalog with pagination and filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getCourses(
    @Query('search') search?: string,
    @Query('teacherId') teacherId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.coursesPublicService.getCourses({
      search,
      teacherId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Retrieve a public course outline and details by slug or code' })
  async getCourseBySlug(@Param('slug') slug: string) {
    return this.coursesPublicService.getCourseBySlug(slug);
  }
}

// Simple decorator placeholder if needed, normally routes are public by default if no guard is applied
function Public() {
  return (target: any) => {};
}
