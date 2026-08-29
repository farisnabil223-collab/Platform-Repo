import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7, TokenRotatedEvent, DomainEventBus } from '@eduverse/kernel';
import { JwtService } from '@eduverse/security';
import * as crypto from 'crypto';
import { getJwtSecret } from '../../../../config/env.config';

@Injectable()
export class RefreshHandler {
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find the token in the database
    const dbToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!dbToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check token family reuse (theft protection)
    if (dbToken.isRevoked || dbToken.expiresAt < new Date()) {
      // Breach detected! Revoke all tokens in this family familyId
      await prisma.refreshToken.updateMany({
        where: { familyId: dbToken.familyId },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Refresh token reuse detected. Revoking family.');
    }

    // Mark old token as revoked (one-time use rotation)
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { isRevoked: true },
    });

    // Generate new refresh token
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    await prisma.refreshToken.create({
      data: {
        id: generateUuidV7(),
        userId: dbToken.userId,
        tokenHash: newRefreshTokenHash,
        familyId: dbToken.familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Fetch user details and roles
    const user = await prisma.user.findUnique({ where: { id: dbToken.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is inactive or deleted');
    }

    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });
    const rolesList = userRoles.map((ur) => ur.role.name.toUpperCase());

    // Generate new JWT
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: rolesList.join(','),
        roles: rolesList,
      },
      {
        secret: getJwtSecret(),
        jwtid: generateUuidV7(),
        issuer: 'eduverse-identity',
        audience: 'eduverse-clients',
        expiresIn: '15m',
      }
    );

    // Publish event
    await DomainEventBus.getInstance().publish(new TokenRotatedEvent(user.id, user.id));

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
