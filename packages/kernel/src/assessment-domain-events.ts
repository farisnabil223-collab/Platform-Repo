import { DomainEvent } from './domain-event';

export class AssessmentCreatedEvent extends DomainEvent {
  constructor(
    public readonly assessmentId: string,
    public readonly code: string,
    public readonly title: string
  ) {
    super(assessmentId);
  }
}

export class AssessmentPublishedEvent extends DomainEvent {
  constructor(
    public readonly assessmentId: string,
    public readonly versionId: string
  ) {
    super(assessmentId);
  }
}

export class AssessmentOpenedEvent extends DomainEvent {
  constructor(public readonly assessmentId: string) {
    super(assessmentId);
  }
}

export class AssessmentClosedEvent extends DomainEvent {
  constructor(public readonly assessmentId: string) {
    super(assessmentId);
  }
}

export class AttemptStartedEvent extends DomainEvent {
  constructor(
    public readonly attemptId: string,
    public readonly studentId: string,
    public readonly assessmentId: string
  ) {
    super(attemptId);
  }
}

export class AttemptPausedEvent extends DomainEvent {
  constructor(public readonly attemptId: string) {
    super(attemptId);
  }
}

export class AttemptResumedEvent extends DomainEvent {
  constructor(public readonly attemptId: string) {
    super(attemptId);
  }
}

export class AttemptCompletedEvent extends DomainEvent {
  constructor(
    public readonly attemptId: string,
    public readonly studentId: string,
    public readonly score: number
  ) {
    super(attemptId);
  }
}

export class AnswerSavedEvent extends DomainEvent {
  constructor(
    public readonly attemptId: string,
    public readonly questionId: string,
    public readonly answerId: string
  ) {
    super(attemptId);
  }
}

export class AnswerChangedEvent extends DomainEvent {
  constructor(
    public readonly attemptId: string,
    public readonly questionId: string,
    public readonly previousAnswerId: string,
    public readonly newAnswerId: string
  ) {
    super(attemptId);
  }
}

export class AssessmentSubmittedEvent extends DomainEvent {
  constructor(
    public readonly attemptId: string,
    public readonly studentId: string,
    public readonly assessmentId: string
  ) {
    super(attemptId);
  }
}

export class AssessmentGradedEvent extends DomainEvent {
  constructor(
    public readonly attemptId: string,
    public readonly score: number,
    public readonly passed: boolean
  ) {
    super(attemptId);
  }
}

export class ResultPublishedEvent extends DomainEvent {
  constructor(
    public readonly resultId: string,
    public readonly attemptId: string,
    public readonly score: number
  ) {
    super(resultId);
  }
}

export class GradeAppealCreatedEvent extends DomainEvent {
  constructor(
    public readonly appealId: string,
    public readonly resultId: string,
    public readonly studentId: string
  ) {
    super(appealId);
  }
}

export class AppealResolvedEvent extends DomainEvent {
  constructor(
    public readonly appealId: string,
    public readonly status: string,
    public readonly decision?: string
  ) {
    super(appealId);
  }
}

export class QuestionReviewedEvent extends DomainEvent {
  constructor(
    public readonly questionId: string,
    public readonly reviewerId: string
  ) {
    super(questionId);
  }
}

export class ManualReviewAssignedEvent extends DomainEvent {
  constructor(
    public readonly reviewId: string,
    public readonly attemptId: string,
    public readonly reviewerId: string
  ) {
    super(reviewId);
  }
}

export class ManualReviewCompletedEvent extends DomainEvent {
  constructor(
    public readonly reviewId: string,
    public readonly attemptId: string
  ) {
    super(reviewId);
  }
}
