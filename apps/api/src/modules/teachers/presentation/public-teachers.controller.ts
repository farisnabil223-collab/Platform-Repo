import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TeachersPublicService } from '../application/teachers-public.service';

@ApiTags('Public Teachers')
@Controller('public/teachers')
export class PublicTeachersController {
  constructor(private readonly teachersPublicService: TeachersPublicService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve public teachers directory with search and specialty filters' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getTeachers(
    @Query('specialty') specialty?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.teachersPublicService.getTeachers({
      specialty,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Retrieve a single public teacher profile by ID or teacher code' })
  async getTeacher(@Param('slug') slug: string) {
    return this.teachersPublicService.getTeacherByIdOrCode(slug);
  }
}
