import { Module, Global } from '@nestjs/common';
import { IAuditLogRepository } from './domain/audit-log.repository.interface';
import { PrismaAuditLogRepository } from './infrastructure/prisma-audit-log.repository';
import { AuditLogService } from './application/audit-log.service';

@Global()
@Module({
  providers: [
    AuditLogService,
    {
      provide: IAuditLogRepository,
      useClass: PrismaAuditLogRepository,
    },
  ],
  exports: [AuditLogService, IAuditLogRepository],
})
export class AuditModule {}
