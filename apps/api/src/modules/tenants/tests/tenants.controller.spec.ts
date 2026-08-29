import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from '../presentation/tenants-v1.controller';
import { OrganizationsController } from '../presentation/organizations.controller';
import { PlatformController } from '../presentation/platform.controller';
import { OrganizationProvisioningEngine } from '../application/organization-provisioning.engine';
import { OrganizationLifecycleService } from '../application/organization-lifecycle.service';

describe('TenantsModuleControllers', () => {
  let tenantsController: TenantsController;
  let organizationsController: OrganizationsController;
  let platformController: PlatformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController, OrganizationsController, PlatformController],
      providers: [
        {
          provide: OrganizationProvisioningEngine,
          useValue: {
            provision: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: OrganizationLifecycleService,
          useValue: {
            transitionStatus: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    tenantsController = module.get<TenantsController>(TenantsController);
    organizationsController = module.get<OrganizationsController>(OrganizationsController);
    platformController = module.get<PlatformController>(PlatformController);
  });

  it('should be defined', () => {
    expect(tenantsController).toBeDefined();
    expect(organizationsController).toBeDefined();
    expect(platformController).toBeDefined();
  });
});
