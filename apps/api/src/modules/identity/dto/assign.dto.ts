import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ example: 'user-uuid-v7' })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'role-uuid-v7' })
  @IsNotEmpty()
  @IsUUID()
  roleId!: string;
}

export class AssignPermissionDto {
  @ApiProperty({ example: 'role-uuid-v7' })
  @IsNotEmpty()
  @IsUUID()
  roleId!: string;

  @ApiProperty({ example: 'permission-uuid-v7' })
  @IsNotEmpty()
  @IsUUID()
  permissionId!: string;
}
