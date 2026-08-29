export type CourseEnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CERTIFIED' | 'ARCHIVED';

export class CourseStateMachine {
  private readonly validTransitions: Record<CourseEnrollmentStatus, Set<CourseEnrollmentStatus>> = {
    NOT_STARTED: new Set(['IN_PROGRESS', 'ARCHIVED']),
    IN_PROGRESS: new Set(['COMPLETED', 'ARCHIVED']),
    COMPLETED: new Set(['CERTIFIED', 'ARCHIVED', 'IN_PROGRESS']),
    CERTIFIED: new Set(['ARCHIVED']),
    ARCHIVED: new Set(['IN_PROGRESS', 'NOT_STARTED']),
  };

  validateTransition(current: CourseEnrollmentStatus, target: CourseEnrollmentStatus): boolean {
    if (current === target) return true;
    const allowed = this.validTransitions[current];
    return allowed ? allowed.has(target) : false;
  }
}
