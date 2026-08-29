import { Module } from '@nestjs/common';
import { DeviceController } from './controllers/device.controller';
import { SyncController } from './controllers/sync.controller';
import { PushController } from './controllers/push.controller';
import { DiagnosticsController } from './controllers/diagnostics.controller';
import { DeviceLifecycleService } from './device/device-lifecycle.service';
import { FCMPushProvider, APNSPushProvider, PushDispatcherService } from './push/push-dispatcher.service';
import { ServerWinsResolver, ClientWinsResolver, OfflineSyncEngine } from './sync/offline-sync-engine.service';
import { MobileGatewayService } from './gateway/mobile-gateway.service';
import { DiagnosticsService } from './diagnostics/diagnostics.service';

@Module({
  controllers: [
    DeviceController,
    SyncController,
    PushController,
    DiagnosticsController,
  ],
  providers: [
    DeviceLifecycleService,
    FCMPushProvider,
    APNSPushProvider,
    PushDispatcherService,
    ServerWinsResolver,
    ClientWinsResolver,
    OfflineSyncEngine,
    MobileGatewayService,
    DiagnosticsService,
  ],
  exports: [
    DeviceLifecycleService,
    PushDispatcherService,
    OfflineSyncEngine,
    MobileGatewayService,
    DiagnosticsService,
  ],
})
export class MobileModule {}
