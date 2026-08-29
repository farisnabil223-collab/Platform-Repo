import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateRoleHandler } from '../application/commands/create-role.handler';
import { CreatePermissionHandler } from '../application/commands/create-permission.handler';
import { AssignRoleHandler } from '../application/commands/assign-role.handler';
import { AssignPermissionHandler } from '../application/commands/assign-permission.handler';
import { CreateRoleDto } from '../dto/role.dto';
import { CreatePermissionDto } from '../dto/permission.dto';
import { AssignRoleDto, AssignPermissionDto } from '../dto/assign.dto';

@ApiTags('Identity & RBAC Access')
@Controller('identity')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
@ApiBearerAuth()
export class IdentityController {
  constructor(
    private readonly createRoleHandler: CreateRoleHandler,
    private readonly createPermissionHandler: CreatePermissionHandler,
    private readonly assignRoleHandler: AssignRoleHandler,
    private readonly assignPermissionHandler: AssignPermissionHandler
  ) {}

  @Post('roles')
  @ApiOperation({ summary: 'Create a new user role (Admin only)' })
  async createRole(@Body() dto: CreateRoleDto) {
    return this.createRoleHandler.execute(dto);
  }

  @Post('permissions')
  @ApiOperation({ summary: 'Create a new resource permission (Admin only)' })
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.createPermissionHandler.execute(dto);
  }

  @Post('roles/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a role to a user (Admin only)' })
  async assignRole(@Body() dto: AssignRoleDto) {
    await this.assignRoleHandler.execute(dto);
    return { assigned: true };
  }

  @Post('permissions/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a permission to a role (Admin only)' })
  async assignPermission(@Body() dto: AssignPermissionDto) {
    await this.assignPermissionHandler.execute(dto);
    return { assigned: true };
  }
}
