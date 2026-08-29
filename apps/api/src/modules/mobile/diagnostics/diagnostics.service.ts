import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class DiagnosticsService {
  async logCrash(data: {
    orgId: string;
    deviceId: string;
    appVersion: string;
    platform: string;
    stackTrace: string;
    metadata?: any;
  }) {
    return prisma.mobileCrashLog.create({
      data: {
        id: generateUuidV7(),
        organizationId: data.orgId,
        deviceId: data.deviceId,
        appVersion: data.appVersion,
        platform: data.platform,
        stackTrace: data.stackTrace,
        metadata: data.metadata || {},
      },
    });
  }

  async logPerformanceMetric(deviceId: string, type: string, value: number) {
    return prisma.mobilePerformanceMetric.create({
      data: {
        id: generateUuidV7(),
        deviceId,
        metricType: type,
        value,
      },
    });
  }
}
