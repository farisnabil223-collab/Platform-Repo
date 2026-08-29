import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from '../controllers/device.controller';
import { SyncController } from '../controllers/sync.controller';
import { PushController } from '../controllers/push.controller';
import { DiagnosticsController } from '../controllers/diagnostics.controller';
import { DeviceLifecycleService } from '../device/device-lifecycle.service';
import { OfflineSyncEngine } from '../sync/offline-sync-engine.service';
import { DiagnosticsService } from '../diagnostics/diagnostics.service';

describe('MobileModuleControllers', () => {
  let deviceController: DeviceController;
  let syncController: SyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeviceController,
        SyncController,
        PushController,
        DiagnosticsController,
      ],
      providers: [
        {
          provide: DeviceLifecycleService,
          useValue: {
            registerDevice: jest.fn().mockResolvedValue({}),
            blockDevice: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: OfflineSyncEngine,
          useValue: {
            computeSync: jest.fn().mockResolvedValue([]),
            resolveConflict: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: DiagnosticsService,
          useValue: {
            logCrash: jest.fn().mockResolvedValue({}),
            logPerformanceMetric: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    deviceController = module.get<DeviceController>(DeviceController);
    syncController = module.get<SyncController>(SyncController);
  });

  it('should be defined', () => {
    expect(deviceController).toBeDefined();
    expect(syncController).toBeDefined();
  });
});
