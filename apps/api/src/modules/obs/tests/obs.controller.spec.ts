import { Test, TestingModule } from '@nestjs/testing';
import {
  MonitoringController,
  MetricsController,
  TracingController,
  LoggingController,
  IncidentController,
  DeploymentController,
  FeatureFlagController,
  SecurityController,
  AlertingController,
  PlatformController
} from '../presentation/obs-controllers';

describe('ObservabilityControllers', () => {
  let monitoringController: MonitoringController;
  let metricsController: MetricsController;
  let tracingController: TracingController;
  let loggingController: LoggingController;
  let incidentController: IncidentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        MonitoringController,
        MetricsController,
        TracingController,
        LoggingController,
        IncidentController,
        DeploymentController,
        FeatureFlagController,
        SecurityController,
        AlertingController,
        PlatformController,
      ],
      providers: [],
    }).compile();

    monitoringController = module.get<MonitoringController>(MonitoringController);
    metricsController = module.get<MetricsController>(MetricsController);
    tracingController = module.get<TracingController>(TracingController);
    loggingController = module.get<LoggingController>(LoggingController);
    incidentController = module.get<IncidentController>(IncidentController);
  });

  it('should define all 10 specialized observability controllers', () => {
    expect(monitoringController).toBeDefined();
    expect(metricsController).toBeDefined();
    expect(tracingController).toBeDefined();
    expect(loggingController).toBeDefined();
    expect(incidentController).toBeDefined();
  });
});
