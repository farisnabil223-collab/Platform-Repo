import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from '../presentation/dashboard.controller';
import { ReportsController } from '../presentation/reports.controller';
import { AnalyticsController } from '../presentation/analytics.controller';
import { DashboardService } from '../application/dashboard.service';
import { ReportGenerationService } from '../application/report-generation.service';
import { AnalyticsQueryEngine } from '../domain/analytics-query-engine.service';

describe('BiModuleControllers', () => {
  let dashboardController: DashboardController;
  let reportsController: ReportsController;
  let analyticsController: AnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DashboardController,
        ReportsController,
        AnalyticsController,
      ],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getDashboardLayout: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ReportGenerationService,
          useValue: {
            executeReport: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AnalyticsQueryEngine,
          useValue: {
            executeQuery: jest.fn().mockResolvedValue([]),
            resolveDrilldown: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    dashboardController = module.get<DashboardController>(DashboardController);
    reportsController = module.get<ReportsController>(ReportsController);
    analyticsController = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(dashboardController).toBeDefined();
    expect(reportsController).toBeDefined();
    expect(analyticsController).toBeDefined();
  });
});
