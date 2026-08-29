import { Test, TestingModule } from '@nestjs/testing';
import { IdentityController } from '../presentation/identity.controller';
import { CreateRoleHandler } from '../application/commands/create-role.handler';
import { CreatePermissionHandler } from '../application/commands/create-permission.handler';
import { AssignRoleHandler } from '../application/commands/assign-role.handler';
import { AssignPermissionHandler } from '../application/commands/assign-permission.handler';
import { CacheService } from '@eduverse/cache';

describe('IdentityController', () => {
  let controller: IdentityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityController],
      providers: [
        {
          provide: CreateRoleHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreatePermissionHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AssignRoleHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AssignPermissionHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<IdentityController>(IdentityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
