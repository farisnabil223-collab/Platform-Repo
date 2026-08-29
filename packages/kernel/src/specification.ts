export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class MinimumGradeSpecification implements ISpecification<{ grade: number; minGrade: number }> {
  isSatisfiedBy(candidate: { grade: number; minGrade: number }): boolean {
    return candidate.grade >= candidate.minGrade;
  }
}

export class AttendanceSpecification implements ISpecification<{ attendancePct: number; requiredPct: number }> {
  isSatisfiedBy(candidate: { attendancePct: number; requiredPct: number }): boolean {
    return candidate.attendancePct >= candidate.requiredPct;
  }
}

export class CompletionSpecification implements ISpecification<{ progressPct: number; requiredPct: number }> {
  isSatisfiedBy(candidate: { progressPct: number; requiredPct: number }): boolean {
    return candidate.progressPct >= candidate.requiredPct;
  }
}

export class ApprovalSpecification implements ISpecification<{ approvedByAdmin: boolean; required: boolean }> {
  isSatisfiedBy(candidate: { approvedByAdmin: boolean; required: boolean }): boolean {
    if (!candidate.required) return true;
    return candidate.approvedByAdmin;
  }
}
