import { AggregateRoot } from './aggregate-root';
import { BaseEntity } from './base-entity';
import {
  AssessmentCode,
  QuestionCode,
  AttemptNumber,
  PassingScore,
  Score,
  AssessmentDuration,
  QuestionDifficulty,
  QuestionType
} from './assessment-value-objects';

// ==========================================
// 1. Assessment Aggregate Root
// ==========================================

export interface AssessmentProps {
  code: AssessmentCode;
  title: string;
  type: string; // EXAM, PRACTICE_EXAM, QUIZ, PLACEMENT, DIAGNOSTIC
  status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'OPEN' | 'CLOSED' | 'GRADING' | 'PUBLISHED' | 'ARCHIVED';
  maxScore: Score;
  passingScore: PassingScore;
  durationSeconds: AssessmentDuration;
  settings: Record<string, any>;
  version: number;
}

export class Assessment extends AggregateRoot<AssessmentProps> {
  constructor(id: string, props: AssessmentProps, version = 1) {
    super(id, props, version);
  }

  get code() { return this.props.code; }
  get title() { return this.props.title; }
  get type() { return this.props.type; }
  get status() { return this.props.status; }
  get maxScore() { return this.props.maxScore; }
  get passingScore() { return this.props.passingScore; }
  get durationSeconds() { return this.props.durationSeconds; }
  get settings() { return this.props.settings; }

  updateStatus(status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'OPEN' | 'CLOSED' | 'GRADING' | 'PUBLISHED' | 'ARCHIVED') {
    this.props.status = status;
  }
}

// ==========================================
// 2. Question Bank Aggregate Root
// ==========================================

export interface QuestionBankProps {
  title: string;
  description?: string;
}

export class QuestionBank extends AggregateRoot<QuestionBankProps> {
  constructor(id: string, props: QuestionBankProps, version = 1) {
    super(id, props, version);
  }

  get title() { return this.props.title; }
  get description() { return this.props.description; }
}

// ==========================================
// 3. Question Aggregate Root
// ==========================================

export interface QuestionProps {
  bankId?: string;
  code: QuestionCode;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  text: string;
  version: number;
}

export class Question extends AggregateRoot<QuestionProps> {
  constructor(id: string, props: QuestionProps, version = 1) {
    super(id, props, version);
  }

  get bankId() { return this.props.bankId; }
  get code() { return this.props.code; }
  get type() { return this.props.type; }
  get difficulty() { return this.props.difficulty; }
  get text() { return this.props.text; }
}

// ==========================================
// 4. Question Version Entity
// ==========================================

export interface QuestionVersionProps {
  questionId: string;
  text: string;
  versionNum: number;
  choicesJson: Record<string, any>;
}

export class QuestionVersion extends BaseEntity<QuestionVersionProps> {
  constructor(id: string, props: QuestionVersionProps) {
    super(id, props);
  }

  get questionId() { return this.props.questionId; }
  get text() { return this.props.text; }
  get versionNum() { return this.props.versionNum; }
  get choicesJson() { return this.props.choicesJson; }
}

// ==========================================
// 5. Assessment Attempt Aggregate Root
// ==========================================

export interface AssessmentAttemptProps {
  assessmentId: string;
  studentId: string;
  status: 'CREATED' | 'STARTED' | 'IN_PROGRESS' | 'AUTO_SAVED' | 'SUBMITTED' | 'AUTO_GRADED' | 'MANUAL_REVIEW' | 'COMPLETED' | 'PUBLISHED';
  attemptNum: AttemptNumber;
  startedAt: Date;
  submittedAt?: Date;
  savedAnswers?: Record<string, any>;
  version: number;
}

export class AssessmentAttempt extends AggregateRoot<AssessmentAttemptProps> {
  constructor(id: string, props: AssessmentAttemptProps, version = 1) {
    super(id, props, version);
  }

  get assessmentId() { return this.props.assessmentId; }
  get studentId() { return this.props.studentId; }
  get status() { return this.props.status; }
  get attemptNum() { return this.props.attemptNum; }
  get startedAt() { return this.props.startedAt; }
  get submittedAt() { return this.props.submittedAt; }
  get savedAnswers() { return this.props.savedAnswers; }

  updateStatus(status: 'CREATED' | 'STARTED' | 'IN_PROGRESS' | 'AUTO_SAVED' | 'SUBMITTED' | 'AUTO_GRADED' | 'MANUAL_REVIEW' | 'COMPLETED' | 'PUBLISHED') {
    this.props.status = status;
  }

  submit() {
    this.props.status = 'SUBMITTED';
    this.props.submittedAt = new Date();
  }
}

// ==========================================
// 6. Question Answer Entity (Answer Bounded Context)
// ==========================================

export interface QuestionAnswerProps {
  attemptId: string;
  questionId: string;
  textResponse?: string;
  selectedChoices: string[];
  pointsAwarded?: Score;
  isGraded: boolean;
  feedback?: string;
}

export class QuestionAnswer extends BaseEntity<QuestionAnswerProps> {
  constructor(id: string, props: QuestionAnswerProps) {
    super(id, props);
  }

  get attemptId() { return this.props.attemptId; }
  get questionId() { return this.props.questionId; }
  get textResponse() { return this.props.textResponse; }
  get selectedChoices() { return this.props.selectedChoices; }
  get pointsAwarded() { return this.props.pointsAwarded; }
  get isGraded() { return this.props.isGraded; }
  get feedback() { return this.props.feedback; }

  grade(score: Score, feedback?: string) {
    this.props.pointsAwarded = score;
    this.props.isGraded = true;
    this.props.feedback = feedback;
  }
}

// ==========================================
// 7. Assessment Result Aggregate Root
// ==========================================

export interface AssessmentResultProps {
  attemptId: string;
  score: Score;
  percentage: number;
  grade: string;
  passed: boolean;
  publishedAt?: Date;
}

export class AssessmentResult extends AggregateRoot<AssessmentResultProps> {
  constructor(id: string, props: AssessmentResultProps, version = 1) {
    super(id, props, version);
  }

  get attemptId() { return this.props.attemptId; }
  get score() { return this.props.score; }
  get percentage() { return this.props.percentage; }
  get grade() { return this.props.grade; }
  get passed() { return this.props.passed; }
  get publishedAt() { return this.props.publishedAt; }

  publish() {
    this.props.publishedAt = new Date();
  }
}

// ==========================================
// 8. Rubric Entity
// ==========================================

export interface RubricProps {
  title: string;
  criteria: Record<string, any>;
}

export class Rubric extends BaseEntity<RubricProps> {
  constructor(id: string, props: RubricProps) {
    super(id, props);
  }

  get title() { return this.props.title; }
  get criteria() { return this.props.criteria; }
}

// ==========================================
// 9. Grading Policy Aggregate Root
// ==========================================

export interface GradingPolicyProps {
  latePenaltyPercent: number;
  negativeMarkingLimit: number;
  rubricJson?: Record<string, any>;
}

export class GradingPolicy extends AggregateRoot<GradingPolicyProps> {
  constructor(id: string, props: GradingPolicyProps, version = 1) {
    super(id, props, version);
  }

  get latePenaltyPercent() { return this.props.latePenaltyPercent; }
  get negativeMarkingLimit() { return this.props.negativeMarkingLimit; }
  get rubricJson() { return this.props.rubricJson; }
}
