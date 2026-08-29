import { Controller, Get, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { IRecommendationProvider } from '../domain/scoring-providers.interface';

@ApiTags('Student Success Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student-success')
export class StudentSuccessController {
  constructor(
    @Inject(IRecommendationProvider) private readonly recommendationEngine: IRecommendationProvider
  ) {}

  @Get('timeline')
  @ApiOperation({ summary: 'Get unified student success timeline' })
  async getTimeline(@Query('studentId') studentId: string) {
    const list = await prisma.studentSuccessTimeline.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: list };
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get daily student analytics snapshot' })
  async getAnalytics(@Query('studentId') studentId: string) {
    const snapshot = await prisma.studentAnalyticsSnapshot.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: snapshot };
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get student academic recommendations' })
  async getRecommendations(@Query('studentId') studentId: string) {
    const recs = await this.recommendationEngine.getRecommendations(studentId);
    return { success: true, data: recs };
  }
}
