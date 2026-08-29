import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../presentation/auth.controller';
import { RegisterHandler } from '../application/commands/register.handler';
import { LoginHandler } from '../application/commands/login.handler';
import { RefreshHandler } from '../application/commands/refresh.handler';
import { LogoutHandler } from '../application/commands/logout.handler';
import { OtpHandler } from '../application/commands/otp.handler';
import { VerifyEmailHandler } from '../application/commands/verify-email.handler';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: LoginHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RefreshHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: LogoutHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: OtpHandler,
          useValue: { sendOtp: jest.fn(), verifyOtp: jest.fn() },
        },
        {
          provide: VerifyEmailHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
