import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AssessmentAnalyticsService } from '../application/assessment-analytics.service';

@ApiTags('Assessment & Questions Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('assessments/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AssessmentAnalyticsService) {}

  @Get('assessment/statistics')
  @ApiOperation({ summary: 'Get assessment pass rates and stats' })
  async getAssessmentStats(@Query('assessmentId') id: string) {
    const stats = await this.analyticsService.getAssessmentStats(id);
    return { success: true, data: stats };
  }

  @Get('question/statistics')
  @ApiOperation({ summary: 'Get question difficulty index' })
  async getQuestionStats(@Query('questionId') id: string) {
    const stats = await this.analyticsService.getQuestionStats(id);
    return { success: true, data: stats };
  }
}
