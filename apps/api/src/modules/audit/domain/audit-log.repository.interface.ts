export interface IAuditLogRepository {
  create(log: {
    userId: string | null;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    traceId?: string;
    success?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}
export const IAuditLogRepository = Symbol('IAuditLogRepository');
