export class WorkflowEngine {
  private static courseTransitions: Record<string, string[]> = {
    DRAFT: ['REVIEW'],
    REVIEW: ['APPROVED', 'DRAFT'],
    APPROVED: ['PUBLISHED'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: [],
  };

  private static mediaTransitions: Record<string, string[]> = {
    UPLOADED: ['QUEUED'],
    QUEUED: ['PROCESSING', 'FAILED'],
    PROCESSING: ['READY', 'FAILED'],
    READY: ['ARCHIVED'],
    FAILED: ['QUEUED', 'ARCHIVED'],
    ARCHIVED: [],
  };

  private static assessmentTransitions: Record<string, string[]> = {
    DRAFT: ['REVIEW'],
    REVIEW: ['SCHEDULED', 'DRAFT'],
    SCHEDULED: ['OPEN', 'DRAFT'],
    OPEN: ['CLOSED'],
    CLOSED: ['GRADING'],
    GRADING: ['PUBLISHED'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: [],
  };

  private static attemptTransitions: Record<string, string[]> = {
    CREATED: ['STARTED'],
    STARTED: ['IN_PROGRESS'],
    IN_PROGRESS: ['AUTO_SAVED', 'SUBMITTED'],
    AUTO_SAVED: ['IN_PROGRESS', 'SUBMITTED'],
    SUBMITTED: ['AUTO_GRADED'],
    AUTO_GRADED: ['MANUAL_REVIEW', 'COMPLETED'],
    MANUAL_REVIEW: ['COMPLETED'],
    COMPLETED: ['PUBLISHED'],
    PUBLISHED: [],
  };

  private static appealTransitions: Record<string, string[]> = {
    SUBMITTED: ['UNDER_REVIEW'],
    UNDER_REVIEW: ['ACCEPTED', 'REJECTED'],
    ACCEPTED: ['CLOSED'],
    REJECTED: ['CLOSED'],
    CLOSED: [],
  };

  public static canTransitionCourse(current: string, next: string): boolean {
    const allowed = this.courseTransitions[current] || [];
    return allowed.includes(next);
  }

  public static canTransitionMedia(current: string, next: string): boolean {
    const allowed = this.mediaTransitions[current] || [];
    return allowed.includes(next);
  }

  public static canTransitionAssessment(current: string, next: string): boolean {
    const allowed = this.assessmentTransitions[current] || [];
    return allowed.includes(next);
  }

  public static canTransitionAttempt(current: string, next: string): boolean {
    const allowed = this.attemptTransitions[current] || [];
    return allowed.includes(next);
  }

  public static canTransitionAppeal(current: string, next: string): boolean {
    const allowed = this.appealTransitions[current] || [];
    return allowed.includes(next);
  }

  public static validateCourseTransition(current: string, next: string): void {
    if (!this.canTransitionCourse(current, next)) {
      throw new Error(`Invalid Course workflow transition from ${current} to ${next}`);
    }
  }

  public static validateMediaTransition(current: string, next: string): void {
    if (!this.canTransitionMedia(current, next)) {
      throw new Error(`Invalid Media workflow transition from ${current} to ${next}`);
    }
  }

  public static validateAssessmentTransition(current: string, next: string): void {
    if (!this.canTransitionAssessment(current, next)) {
      throw new Error(`Invalid Assessment workflow transition from ${current} to ${next}`);
    }
  }

  public static validateAttemptTransition(current: string, next: string): void {
    if (!this.canTransitionAttempt(current, next)) {
      throw new Error(`Invalid Attempt workflow transition from ${current} to ${next}`);
    }
  }

  public static validateAppealTransition(current: string, next: string): void {
    if (!this.canTransitionAppeal(current, next)) {
      throw new Error(`Invalid Appeal workflow transition from ${current} to ${next}`);
    }
  }
}
