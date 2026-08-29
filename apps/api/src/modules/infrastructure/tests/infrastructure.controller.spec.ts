import { Test, TestingModule } from '@nestjs/testing';
import { PlatformController } from '../controllers/platform.controller';
import { JobsController } from '../controllers/jobs.controller';
import { StorageController } from '../controllers/storage.controller';
import { ApiKeysController } from '../controllers/api-keys.controller';
import { JobSchedulerService } from '../queue/job-scheduler.service';
import { StorageService } from '../storage/storage.service';
import { SecretManagerService } from '../security/secret-manager.service';
import { HealthService } from '../monitoring/health.service';

describe('InfrastructureModuleControllers', () => {
  let platformController: PlatformController;
  let jobsController: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PlatformController,
        JobsController,
        StorageController,
        ApiKeysController,
      ],
      providers: [
        {
          provide: JobSchedulerService,
          useValue: {
            queueJob: jest.fn().mockResolvedValue({}),
            retryJob: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: StorageService,
          useValue: {
            uploadObject: jest.fn().mockResolvedValue({}),
            getObject: jest.fn().mockResolvedValue({}),
            deleteObject: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: SecretManagerService,
          useValue: {
            saveSecret: jest.fn().mockResolvedValue({}),
            rotateKey: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: HealthService,
          useValue: {
            saveSnapshot: jest.fn().mockResolvedValue({}),
            getIncidents: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    platformController = module.get<PlatformController>(PlatformController);
    jobsController = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(platformController).toBeDefined();
    expect(jobsController).toBeDefined();
  });
});
