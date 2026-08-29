import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { ChangePasswordHandler } from './application/commands/change-password.handler';
import { IUserRepository } from './domain/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    ChangePasswordHandler,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UsersModule {}
