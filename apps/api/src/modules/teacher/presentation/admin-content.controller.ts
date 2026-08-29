import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContentQualityService } from '../domain/content-quality.service';

@ApiTags('Admin Content Quality Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/content')
export class AdminContentController {
  constructor(private readonly qualityService: ContentQualityService) {}

  @Get('quality/:courseId')
  @ApiOperation({ summary: 'Calculate course quality index' })
  async getCourseQuality(@Param('courseId') courseId: string) {
    const score = await this.qualityService.calculateCourseQualityScore(courseId);
    return { success: true, data: { qualityScore: score } };
  }
}
