import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as argon2 from 'argon2';
import { prisma } from '@eduverse/database';
import { CacheService } from '@eduverse/cache';

// 1. Password Hashing Utility
export const HashUtility = {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  },
  async verify(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  },
};

// 2. Configurable Password Policy
export class PasswordPolicy {
  public static validate(
    password: string,
    config: {
      minLength?: number;
      requireUppercase?: boolean;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
    } = {}
  ): boolean {
    const minLength = config.minLength ?? 8;
    if (password.length < minLength) return false;
    if (config.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (config.requireNumbers && !/[0-9]/.test(password)) return false;
    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
  }
}

// 3. Roles Guard Configuration
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Check if roles exist in JWT claims payload first to avoid DB queries
    if (user.roles && Array.isArray(user.roles)) {
      const normalizedRoles = user.roles.map((r: string) => r.toUpperCase());
      return requiredRoles.some((role) => normalizedRoles.includes(role.toUpperCase()));
    }

    // Fallback: Fetch user roles from DB (e.g. for legacy or bootstrap calls)
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.sub || user.id },
      include: { role: true },
    });

    const rolesList = userRoles.map((ur) => ur.role.name);
    return requiredRoles.some((role) => rolesList.includes(role.toUpperCase()));
  }
}

// 4. Permissions Guard Configuration
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userId = user.sub || user.id;
    const permissions = await this.getUserPermissions(userId);

    // Dynamic Permission & ABAC/PBAC Extensibility Hook
    return requiredPermissions.every((perm) => permissions.includes(perm.toUpperCase()));
  }

  private async getUserPermissions(userId: string): Promise<string[]> {
    const redis = this.cacheService.getClient();
    const cacheKey = `user:permissions:${userId}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Fallback to database on Redis connection failures
    }

    // Query database to fetch all permissions linked to user roles
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map((ur) => ur.roleId);
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId: { in: roleIds } },
      include: { permission: true },
    });

    const permissions = Array.from(
      new Set(rolePermissions.map((rp) => rp.permission.name.toUpperCase()))
    );

    try {
      await redis.set(cacheKey, JSON.stringify(permissions), 'EX', 300); // 5 min TTL
    } catch {
      // Ignore cache set failures
    }

    return permissions;
  }
}

export { JwtModule, JwtService } from '@nestjs/jwt';
export { PassportModule } from '@nestjs/passport';
