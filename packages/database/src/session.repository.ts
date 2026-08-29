import { ISessionRepository, Session } from '@eduverse/kernel';
import { PrismaBaseRepository } from './prisma-repository';
import { PrismaClient, Session as PrismaSession } from '@prisma/client';

export class SessionRepository extends PrismaBaseRepository<Session, PrismaSession> implements ISessionRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.session);
  }

  toDomain(record: PrismaSession): Session {
    return new Session(
      record.id,
      {
        userId: record.userId,
        tokenHash: record.tokenHash,
        userAgent: record.userAgent,
        ipAddress: record.ipAddress,
        isExpired: record.isExpired,
        expiresAt: record.expiresAt,
        lastActivity: record.lastActivity,
      },
      record.version,
      record.createdAt,
      record.lastActivity
    );
  }

  toPersistence(domain: Session): PrismaSession {
    return {
      id: domain.id,
      userId: domain.userId,
      tokenHash: domain.tokenHash,
      userAgent: domain.userAgent,
      ipAddress: domain.ipAddress,
      isExpired: domain.isExpired,
      expiresAt: domain.expiresAt,
      lastActivity: domain.lastActivity,
      createdAt: domain.createdAt,
      version: domain.version,
    };
  }

  async findByTokenHash(tokenHash: string): Promise<Session | null> {
    const record = await this.prismaClient.session.findUnique({
      where: { tokenHash },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const records = await this.prismaClient.session.findMany({
      where: { userId, isExpired: false },
    });
    return records.map((record) => this.toDomain(record));
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prismaClient.session.updateMany({
      where: { userId, isExpired: false },
      data: { isExpired: true },
    });
  }

  async save(entity: Session): Promise<void> {
    const data = this.toPersistence(entity);
    await this.prismaClient.session.upsert({
      where: { id: entity.id },
      update: {
        isExpired: data.isExpired,
        expiresAt: data.expiresAt,
        lastActivity: data.lastActivity,
        version: { increment: 1 },
      },
      create: data,
    });
  }
}
