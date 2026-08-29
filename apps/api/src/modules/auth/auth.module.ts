import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/auth.controller';
import { RegisterHandler } from './application/commands/register.handler';
import { LoginHandler } from './application/commands/login.handler';
import { RefreshHandler } from './application/commands/refresh.handler';
import { LogoutHandler } from './application/commands/logout.handler';
import { OtpHandler } from './application/commands/otp.handler';
import { VerifyEmailHandler } from './application/commands/verify-email.handler';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { UserRepository, SessionRepository, DeviceRepository } from '@eduverse/database';
import { CacheModule } from '@eduverse/cache';
import { getJwtSecret } from '../../config/env.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: '15m' },
    }),
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [
    RegisterHandler,
    LoginHandler,
    RefreshHandler,
    LogoutHandler,
    OtpHandler,
    VerifyEmailHandler,
    JwtStrategy,
    // Database repositories
    {
      provide: UserRepository,
      useFactory: () => new UserRepository(require('@eduverse/database').prisma),
    },
    {
      provide: SessionRepository,
      useFactory: () => new SessionRepository(require('@eduverse/database').prisma),
    },
    {
      provide: DeviceRepository,
      useFactory: () => new DeviceRepository(require('@eduverse/database').prisma),
    },
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    UserRepository,
    SessionRepository,
    DeviceRepository,
  ],
})
export class AuthModule {}
