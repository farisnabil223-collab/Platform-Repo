import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IAuditLogRepository } from '../domain/audit-log.repository.interface';

@Injectable()
export class PrismaAuditLogRepository implements IAuditLogRepository {
  async create(log: {
    userId: string | null;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    traceId?: string;
    success?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        id: generateUuidV7(),
        userId: log.userId,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId || null,
        details: log.details || null,
        traceId: log.traceId || null,
        success: log.success !== undefined ? log.success : true,
        ipAddress: log.ipAddress || null,
        userAgent: log.userAgent || null,
      },
    });
  }
}
