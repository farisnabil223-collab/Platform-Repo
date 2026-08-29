import { Module } from '@nestjs/common';
import { IdentityController } from './presentation/identity.controller';
import { CreateRoleHandler } from './application/commands/create-role.handler';
import { CreatePermissionHandler } from './application/commands/create-permission.handler';
import { AssignRoleHandler } from './application/commands/assign-role.handler';
import { AssignPermissionHandler } from './application/commands/assign-permission.handler';
import { RoleRepository } from '@eduverse/database';
import { CacheModule } from '@eduverse/cache';

@Module({
  imports: [CacheModule],
  controllers: [IdentityController],
  providers: [
    CreateRoleHandler,
    CreatePermissionHandler,
    AssignRoleHandler,
    AssignPermissionHandler,
    {
      provide: RoleRepository,
      useFactory: () => new RoleRepository(require('@eduverse/database').prisma),
    },
  ],
})
export class IdentityModule {}
