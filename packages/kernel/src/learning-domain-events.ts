import { DomainEvent } from './domain-event';

export class CoursePublishedEvent extends DomainEvent {
  constructor(
    public readonly courseId: string,
    public readonly versionId: string,
    public readonly semver: string
  ) {
    super(courseId);
  }
}

export class CourseArchivedEvent extends DomainEvent {
  constructor(public readonly courseId: string) {
    super(courseId);
  }
}

export class LessonCompletedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly lessonId: string
  ) {
    super(lessonId);
  }
}

export class QuizPassedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly quizId: string,
    public readonly attemptId: string,
    public readonly score: number
  ) {
    super(quizId);
  }
}

export class QuizFailedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly quizId: string,
    public readonly attemptId: string,
    public readonly score: number
  ) {
    super(quizId);
  }
}

export class AssignmentSubmittedEvent extends DomainEvent {
  constructor(
    public readonly submissionId: string,
    public readonly studentId: string,
    public readonly assignmentId: string
  ) {
    super(assignmentId);
  }
}

export class AssignmentGradedEvent extends DomainEvent {
  constructor(
    public readonly submissionId: string,
    public readonly score: number,
    public readonly gradedBy: string
  ) {
    super(submissionId);
  }
}

export class MediaProcessedEvent extends DomainEvent {
  constructor(
    public readonly mediaAssetId: string,
    public readonly status: string
  ) {
    super(mediaAssetId);
  }
}

export class ProgressUpdatedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly percentage: number
  ) {
    super(courseId);
  }
}

export class BookmarkCreatedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly lessonId: string,
    public readonly bookmarkId: string
  ) {
    super(lessonId);
  }
}

export class CertificateEligibilityReachedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly courseId: string
  ) {
    super(courseId);
  }
}
