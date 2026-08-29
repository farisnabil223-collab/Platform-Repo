import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { RequestContext, generateUuidV7 } from '@eduverse/kernel';
import { prisma } from '@eduverse/database';

export interface LogMetadata {
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceId?: string | null;
  success?: boolean;
  details?: Record<string, any> | null;
  [key: string]: any;
}

@Injectable()
export class AuditLogger {
  private logger = new NestLogger('AuditLogger');

  logAction(action: string, entityName: string, entityId: string | null, metadata: LogMetadata = {}) {
    const traceId = RequestContext.getTraceId();
    const userId = metadata.userId || RequestContext.getUserId() || null;
    const success = metadata.success ?? true;

    const payload = {
      logType: 'audit',
      action,
      entityName,
      entityId,
      userId,
      traceId,
      success,
      ipAddress: metadata.ipAddress || null,
      userAgent: metadata.userAgent || null,
      deviceId: metadata.deviceId || null,
      details: metadata.details || null,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(JSON.stringify(payload));

    // Save to Postgres Audit Logs table asynchronously
    prisma.auditLog.create({
      data: {
        id: generateUuidV7(),
        userId,
        action,
        entity: entityName,
        entityId,
        details: metadata.details || {},
        ipAddress: metadata.ipAddress || null,
        userAgent: metadata.userAgent || null,
        deviceId: metadata.deviceId || null,
        traceId,
        success,
      },
    }).catch((err: any) => {
      this.logger.error('Failed to write audit log to database', err.stack);
    });
  }
}

@Injectable()
export class SecurityLogger {
  private logger = new NestLogger('SecurityLogger');

  logSecurity(event: string, status: 'SUCCESS' | 'FAIL', metadata: LogMetadata = {}) {
    const traceId = RequestContext.getTraceId();
    const userId = metadata.userId || RequestContext.getUserId() || null;
    const success = status === 'SUCCESS';

    const payload = {
      logType: 'security',
      event,
      status,
      userId,
      traceId,
      success,
      ipAddress: metadata.ipAddress || null,
      userAgent: metadata.userAgent || null,
      deviceId: metadata.deviceId || null,
      details: metadata.details || null,
      timestamp: new Date().toISOString(),
    };

    if (status === 'FAIL') {
      this.logger.warn(JSON.stringify(payload));
    } else {
      this.logger.log(JSON.stringify(payload));
    }

    // Save to Postgres Audit Logs table
    prisma.auditLog.create({
      data: {
        id: generateUuidV7(),
        userId,
        action: `SECURITY_${event}`,
        entity: 'Security',
        entityId: null,
        details: { status, ...(metadata.details || {}) },
        ipAddress: metadata.ipAddress || null,
        userAgent: metadata.userAgent || null,
        deviceId: metadata.deviceId || null,
        traceId,
        success,
      },
    }).catch((err: any) => {
      this.logger.error('Failed to write security audit log to database', err.stack);
    });
  }
}

@Injectable()
export class BusinessLogger {
  private logger = new NestLogger('BusinessLogger');

  logBusiness(message: string, contextName: string, metadata: Record<string, any> = {}) {
    const traceId = RequestContext.getTraceId();
    const userId = RequestContext.getUserId() || 'SYSTEM';

    this.logger.log(
      JSON.stringify({
        logType: 'business',
        message,
        contextName,
        userId,
        traceId,
        metadata,
        timestamp: new Date().toISOString(),
      })
    );
  }
}
