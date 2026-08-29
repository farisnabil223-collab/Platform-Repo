import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/dashboard.controller';
import { ReportsController } from './presentation/reports.controller';
import { AnalyticsController } from './presentation/analytics.controller';
import { AnalyticsQueryEngine } from './domain/analytics-query-engine.service';
import { AnalyticsAggregationService } from './application/analytics-aggregation.service';
import { KpiCalculationService } from './application/kpi-calculation.service';
import { DashboardService } from './application/dashboard.service';
import { ReportGenerationService } from './application/report-generation.service';

import { AnalyticsController as CoreAnalyticsController } from '../analytics/presentation/analytics.controller';
import { AnalyticsService } from '../analytics/application/analytics.service';

@Module({
  controllers: [
    DashboardController,
    ReportsController,
    AnalyticsController,
    CoreAnalyticsController,
  ],
  providers: [
    AnalyticsQueryEngine,
    AnalyticsAggregationService,
    KpiCalculationService,
    DashboardService,
    ReportGenerationService,
    AnalyticsService,
  ],
  exports: [
    AnalyticsQueryEngine,
    AnalyticsAggregationService,
    KpiCalculationService,
    DashboardService,
    ReportGenerationService,
    AnalyticsService,
  ],
})
export class BiModule {}
