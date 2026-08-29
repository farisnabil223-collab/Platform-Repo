import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { SessionRepository } from '@eduverse/database';
import { SessionTerminatedEvent, DomainEventBus } from '@eduverse/kernel';

@Injectable()
export class LogoutHandler {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(userId: string, sessionId: string | null, allDevices = false, jti?: string, exp?: number): Promise<void> {
    if (allDevices) {
      // Revoke all active sessions for user
      await this.sessionRepository.revokeAllUserSessions(userId);

      // Revoke all refresh tokens
      await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    } else if (sessionId) {
      const session = await this.sessionRepository.findById(sessionId);
      if (session) {
        session.terminate();
        await this.sessionRepository.save(session);
      }
    }

    // Blacklist access token JTI if present
    if (jti && exp) {
      const expiresAt = new Date(exp * 1000);
      await prisma.revokedToken.upsert({
        where: { jti },
        update: {},
        create: {
          jti,
          expiresAt,
        },
      });
    }

    // Publish event
    await DomainEventBus.getInstance().publish(new SessionTerminatedEvent(userId, userId));
  }
}
