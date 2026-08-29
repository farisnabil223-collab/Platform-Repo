import { Certificate, IssuerOrganization } from './credential-aggregates';
import { MinimumGradeSpecification, AttendanceSpecification, CompletionSpecification, ApprovalSpecification } from './specification';

export class PolicyEvaluationService {
  private minGradeSpec = new MinimumGradeSpecification();
  private attendanceSpec = new AttendanceSpecification();
  private completionSpec = new CompletionSpecification();
  private approvalSpec = new ApprovalSpecification();

  evaluate(
    issuer: IssuerOrganization,
    studentMetrics: { grade: number; attendancePct: number; progressPct: number; approvedByAdmin: boolean }
  ): boolean {
    const policies = issuer.policies as any;
    if (!policies) return true;

    const minGrade = policies.minGrade ?? 0;
    const requiredAttendance = policies.requiredAttendancePct ?? 0;
    const requiredCompletion = policies.requiredCompletionPct ?? 0;
    const manualApproval = policies.manualApprovalRequired ?? false;

    const gradeOk = this.minGradeSpec.isSatisfiedBy({ grade: studentMetrics.grade, minGrade });
    const attendanceOk = this.attendanceSpec.isSatisfiedBy({ attendancePct: studentMetrics.attendancePct, requiredPct: requiredAttendance });
    const completionOk = this.completionSpec.isSatisfiedBy({ progressPct: studentMetrics.progressPct, requiredPct: requiredCompletion });
    const approvalOk = this.approvalSpec.isSatisfiedBy({ approvedByAdmin: studentMetrics.approvedByAdmin, required: manualApproval });

    return gradeOk && attendanceOk && completionOk && approvalOk;
  }
}

export class CertificateIssuanceService {
  constructor(private readonly policyEvaluationService: PolicyEvaluationService) {}

  issue(
    certificate: Certificate,
    issuer: IssuerOrganization,
    studentMetrics: { grade: number; attendancePct: number; progressPct: number; approvedByAdmin: boolean }
  ): void {
    const ok = this.policyEvaluationService.evaluate(issuer, studentMetrics);
    if (!ok) {
      throw new Error(`Issuance policies not satisfied for student: ${certificate.studentId}`);
    }
    certificate.updateStatus('ISSUED');
  }
}

export class CertificateVerificationService {
  verify(certificate: Certificate): boolean {
    if (certificate.status === 'REVOKED') return false;
    if (certificate.status === 'EXPIRED') return false;
    return certificate.signature !== undefined;
  }
}

export class RevocationService {
  revoke(certificate: Certificate): void {
    certificate.updateStatus('REVOKED');
  }
}
