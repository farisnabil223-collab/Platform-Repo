import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../presentation/users.controller';
import { ChangePasswordHandler } from '../application/commands/change-password.handler';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ChangePasswordHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
