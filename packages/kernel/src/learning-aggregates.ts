import { AggregateRoot } from './aggregate-root';
import { BaseEntity } from './base-entity';
import { CourseCode, CourseSlug, VersionNumber, ModuleCode, LessonCode, ContentType, CompletionPercentage } from './learning-value-objects';

export interface CourseProps {
  code: CourseCode;
  slug: CourseSlug;
  title: string;
  description?: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  teacherId: string;
  currentVersionId?: string;
  version: number;
}

export class Course extends AggregateRoot<CourseProps> {
  constructor(id: string, props: CourseProps, version = 1) {
    super(id, props, version);
  }

  get code() { return this.props.code; }
  get slug() { return this.props.slug; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get status() { return this.props.status; }
  get teacherId() { return this.props.teacherId; }
  get currentVersionId() { return this.props.currentVersionId; }

  transitionTo(newStatus: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED') {
    this.props.status = newStatus;
  }

  setCurrentVersion(versionId: string) {
    this.props.currentVersionId = versionId;
  }
}

export interface CourseVersionProps {
  courseId: string;
  semver: VersionNumber;
  structure: any;
  isActive: boolean;
}

export class CourseVersion extends BaseEntity<CourseVersionProps> {
  constructor(id: string, props: CourseVersionProps, version = 1) {
    super(id, props, version);
  }

  get courseId() { return this.props.courseId; }
  get semver() { return this.props.semver; }
  get structure() { return this.props.structure; }
  get isActive() { return this.props.isActive; }

  activate() {
    this.props.isActive = true;
  }
}

export interface ModuleProps {
  courseId: string;
  code: ModuleCode;
  title: string;
  sortOrder: number;
}

export class Module extends BaseEntity<ModuleProps> {
  constructor(id: string, props: ModuleProps, version = 1) {
    super(id, props, version);
  }

  get courseId() { return this.props.courseId; }
  get code() { return this.props.code; }
  get title() { return this.props.title; }
  get sortOrder() { return this.props.sortOrder; }
}

export interface LessonProps {
  moduleId: string;
  code: LessonCode;
  title: string;
  sortOrder: number;
  displayOrder: number;
  estimatedDuration: number;
  isLocked: boolean;
  unlockCondition?: any;
}

export class Lesson extends BaseEntity<LessonProps> {
  constructor(id: string, props: LessonProps, version = 1) {
    super(id, props, version);
  }

  get moduleId() { return this.props.moduleId; }
  get code() { return this.props.code; }
  get title() { return this.props.title; }
  get sortOrder() { return this.props.sortOrder; }
  get displayOrder() { return this.props.displayOrder; }
  get estimatedDuration() { return this.props.estimatedDuration; }
  get isLocked() { return this.props.isLocked; }
  get unlockCondition() { return this.props.unlockCondition; }
}

export interface LearningContentProps {
  lessonId: string;
  contentType: ContentType;
  title: string;
  sortOrder: number;
  currentVersionId?: string;
  quizId?: string;
  assignmentId?: string;
}

export class LearningContent extends AggregateRoot<LearningContentProps> {
  constructor(id: string, props: LearningContentProps, version = 1) {
    super(id, props, version);
  }

  get lessonId() { return this.props.lessonId; }
  get contentType() { return this.props.contentType; }
  get title() { return this.props.title; }
  get sortOrder() { return this.props.sortOrder; }
  get currentVersionId() { return this.props.currentVersionId; }
  get quizId() { return this.props.quizId; }
  get assignmentId() { return this.props.assignmentId; }

  setCurrentVersion(versionId: string) {
    this.props.currentVersionId = versionId;
  }
}

export interface MediaAssetProps {
  title: string;
  storageProvider: string;
  storagePath: string;
  streamingUrl?: string;
  subtitles?: any;
  status: 'UPLOADED' | 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED' | 'ARCHIVED';
  errorMessage?: string;
}

export class MediaAsset extends AggregateRoot<MediaAssetProps> {
  constructor(id: string, props: MediaAssetProps, version = 1) {
    super(id, props, version);
  }

  get title() { return this.props.title; }
  get storageProvider() { return this.props.storageProvider; }
  get storagePath() { return this.props.storagePath; }
  get streamingUrl() { return this.props.streamingUrl; }
  get subtitles() { return this.props.subtitles; }
  get status() { return this.props.status; }
  get errorMessage() { return this.props.errorMessage; }

  updateStatus(newStatus: 'UPLOADED' | 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED' | 'ARCHIVED', errMsg?: string) {
    this.props.status = newStatus;
    if (errMsg) this.props.errorMessage = errMsg;
  }
}

export interface CourseProgressProps {
  studentId: string;
  courseId: string;
  courseVersionId: string;
  percentage: CompletionPercentage;
  timeSpent: number;
  activeLearningTime: number;
  learningStreak: number;
  lastLessonId?: string;
  lastAccessedAt: Date;
  completedAt?: Date;
}

export class CourseProgress extends AggregateRoot<CourseProgressProps> {
  constructor(id: string, props: CourseProgressProps, version = 1) {
    super(id, props, version);
  }

  get studentId() { return this.props.studentId; }
  get courseId() { return this.props.courseId; }
  get courseVersionId() { return this.props.courseVersionId; }
  get percentage() { return this.props.percentage; }
  get timeSpent() { return this.props.timeSpent; }
  get activeLearningTime() { return this.props.activeLearningTime; }
  get learningStreak() { return this.props.learningStreak; }
  get lastLessonId() { return this.props.lastLessonId; }
  get lastAccessedAt() { return this.props.lastAccessedAt; }
  get completedAt() { return this.props.completedAt; }

  updateAccess(lessonId: string) {
    this.props.lastLessonId = lessonId;
    this.props.lastAccessedAt = new Date();
  }

  updateProgress(newPercentage: CompletionPercentage) {
    this.props.percentage = newPercentage;
    if (newPercentage.value >= 100 && !this.props.completedAt) {
      this.props.completedAt = new Date();
    }
  }
}

export interface LessonProgressProps {
  studentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
  resumePosition: number;
  watchOffset: number;
}

export class LessonProgress extends AggregateRoot<LessonProgressProps> {
  constructor(id: string, props: LessonProgressProps, version = 1) {
    super(id, props, version);
  }

  get studentId() { return this.props.studentId; }
  get lessonId() { return this.props.lessonId; }
  get isCompleted() { return this.props.isCompleted; }
  get completedAt() { return this.props.completedAt; }
  get resumePosition() { return this.props.resumePosition; }
  get watchOffset() { return this.props.watchOffset; }

  complete() {
    this.props.isCompleted = true;
    this.props.completedAt = new Date();
  }
}

export interface QuizProps {
  title: string;
  passingScore: number;
  timeLimitSeconds: number;
  isActive: boolean;
}

export class Quiz extends AggregateRoot<QuizProps> {
  constructor(id: string, props: QuizProps, version = 1) {
    super(id, props, version);
  }

  get title() { return this.props.title; }
  get passingScore() { return this.props.passingScore; }
  get timeLimitSeconds() { return this.props.timeLimitSeconds; }
  get isActive() { return this.props.isActive; }
}

export interface AssignmentProps {
  title: string;
  instructions?: string;
  maxScore: number;
  dueDate?: Date;
  rubric?: any;
  gradingCriteria?: any;
  maxAttempts: number;
  lateSubmissionPolicy?: any;
}

export class Assignment extends AggregateRoot<AssignmentProps> {
  constructor(id: string, props: AssignmentProps, version = 1) {
    super(id, props, version);
  }

  get title() { return this.props.title; }
  get instructions() { return this.props.instructions; }
  get maxScore() { return this.props.maxScore; }
  get dueDate() { return this.props.dueDate; }
  get rubric() { return this.props.rubric; }
  get gradingCriteria() { return this.props.gradingCriteria; }
  get maxAttempts() { return this.props.maxAttempts; }
  get lateSubmissionPolicy() { return this.props.lateSubmissionPolicy; }
}
