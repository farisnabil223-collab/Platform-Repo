import { Module } from '@nestjs/common';
import { StudentEnrollmentController } from './presentation/student-enrollment.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [StudentEnrollmentController],
  providers: [],
})
export class EnrollmentModule {}
