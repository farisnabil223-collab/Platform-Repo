import { Module } from '@nestjs/common';
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
} from './presentation/obs-controllers';

@Module({
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
  exports: [],
})
export class ObsModule {}
