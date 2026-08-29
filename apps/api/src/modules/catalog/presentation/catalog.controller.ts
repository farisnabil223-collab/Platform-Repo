import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@eduverse/security';
import { prisma } from '@eduverse/database';

@ApiTags('Course Catalog')
@Controller('catalog')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CatalogController {
  @Get('trending')
  @ApiOperation({ summary: 'Retrieve trending courses list' })
  async getTrending() {
    return prisma.catalogCourse.findMany({
      where: { isTrending: true },
      include: {
        course: true,
        categoryRef: true,
      },
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Retrieve featured courses list' })
  async getFeatured() {
    return prisma.catalogCourse.findMany({
      where: { isFeatured: true },
      include: {
        course: true,
        categoryRef: true,
      },
    });
  }
}
