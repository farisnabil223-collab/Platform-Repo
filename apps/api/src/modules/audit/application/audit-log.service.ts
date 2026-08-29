import { Injectable, Inject } from '@nestjs/common';
import { IAuditLogRepository } from '../domain/audit-log.repository.interface';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject(IAuditLogRepository)
    private readonly auditLogRepository: IAuditLogRepository
  ) {}

  async log(params: {
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
    await this.auditLogRepository.create(params);
  }
}
