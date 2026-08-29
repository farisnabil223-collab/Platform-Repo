import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BundleService } from '../application/bundle.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Bundles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('bundles')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @Get()
  @ApiOperation({ summary: 'List all multi-course bundles' })
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    const data = await this.bundleService.getBundles(parseInt(page, 10), parseInt(limit, 10));
    return {
      success: true,
      message: 'Bundles retrieved successfully',
      data: data.items,
      meta: {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific bundle details' })
  async getOne(@Param('id') id: string) {
    const bundle = await this.bundleService.getBundleById(id);
    return {
      success: true,
      message: 'Bundle retrieved successfully',
      data: bundle,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new course bundle' })
  async create(@Body() body: any) {
    const bundle = await this.bundleService.createBundle(body);
    return {
      success: true,
      message: 'Bundle created successfully',
      data: bundle,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course bundle' })
  async delete(@Param('id') id: string) {
    await this.bundleService.deleteBundle(id);
    return {
      success: true,
      message: 'Bundle deleted successfully',
    };
  }
}
