import { AggregateRoot } from './aggregate-root';
import { DomainRuleViolationException } from './domain-exceptions';
import { GradeLevel, SubjectCode, AcademicYearCode, StudentCode, TeacherCode, EnrollmentNumber } from './academic-value-objects';

export interface GradeProps {
  level: GradeLevel;
  name: string;
  description?: string | null;
}

export class Grade extends AggregateRoot<GradeProps> {
  get level(): GradeLevel { return this.props.level; }
  get name(): string { return this.props.name; }
  get description(): string | null { return this.props.description || null; }
}

export interface ClassroomProps {
  name: string;
  code: string;
  capacity: number;
}

export class Classroom extends AggregateRoot<ClassroomProps> {
  get name(): string { return this.props.name; }
  get code(): string { return this.props.code; }
  get capacity(): number { return this.props.capacity; }

  constructor(id: string, props: ClassroomProps, version: number = 1) {
    super(id, props, version);
    if (props.capacity <= 0) {
      throw new DomainRuleViolationException('Classroom capacity must be greater than zero');
    }
  }
}

export interface SectionProps {
  name: string;
  code: string;
  gradeId: string;
  classroomId: string;
}

export class Section extends AggregateRoot<SectionProps> {
  get name(): string { return this.props.name; }
  get code(): string { return this.props.code; }
  get gradeId(): string { return this.props.gradeId; }
  get classroomId(): string { return this.props.classroomId; }
}

export interface SubjectProps {
  code: SubjectCode;
  name: string;
  description?: string | null;
  creditHours: number;
  weeklyHours: number;
  isElective: boolean;
  isActive: boolean;
  gradeId: string;
}

export class Subject extends AggregateRoot<SubjectProps> {
  get code(): SubjectCode { return this.props.code; }
  get name(): string { return this.props.name; }
  get description(): string | null { return this.props.description || null; }
  get creditHours(): number { return this.props.creditHours; }
  get weeklyHours(): number { return this.props.weeklyHours; }
  get isElective(): boolean { return this.props.isElective; }
  get isActive(): boolean { return this.props.isActive; }
  get gradeId(): string { return this.props.gradeId; }

  constructor(id: string, props: SubjectProps, version: number = 1) {
    super(id, props, version);
    if (props.creditHours <= 0 || props.weeklyHours <= 0) {
      throw new DomainRuleViolationException('Credit hours and weekly hours must be positive integers');
    }
  }
}

export type AcademicYearStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface AcademicTermProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  sortOrder: number;
  isActive: boolean;
}

export interface AcademicYearProps {
  name: AcademicYearCode;
  startDate: Date;
  endDate: Date;
  status: AcademicYearStatus;
  terms: AcademicTermProps[];
}

export class AcademicYear extends AggregateRoot<AcademicYearProps> {
  get name(): AcademicYearCode { return this.props.name; }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date { return this.props.endDate; }
  get status(): AcademicYearStatus { return this.props.status; }
  get terms(): AcademicTermProps[] { return this.props.terms; }

  constructor(id: string, props: AcademicYearProps, version: number = 1) {
    super(id, props, version);
    if (props.startDate >= props.endDate) {
      throw new DomainRuleViolationException('Academic Year start date must precede end date');
    }
  }

  transitionTo(newStatus: AcademicYearStatus): void {
    const transitions: Record<AcademicYearStatus, AcademicYearStatus[]> = {
      DRAFT: ['UPCOMING', 'CLOSED'],
      UPCOMING: ['ACTIVE', 'CLOSED'],
      ACTIVE: ['CLOSED'],
      CLOSED: ['ARCHIVED'],
      ARCHIVED: [],
    };
    if (!transitions[this.props.status].includes(newStatus)) {
      throw new DomainRuleViolationException(`Invalid state transition from ${this.props.status} to ${newStatus}`);
    }
    this.props.status = newStatus;
  }
}

export interface StudentProfileProps {
  userId: string;
  studentCode: StudentCode;
  gradeId?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPELLED';
  academicMetadata: Record<string, any>;
}

export class StudentProfile extends AggregateRoot<StudentProfileProps> {
  get userId(): string { return this.props.userId; }
  get studentCode(): StudentCode { return this.props.studentCode; }
  get gradeId(): string | null { return this.props.gradeId || null; }
  get status(): string { return this.props.status; }
  get academicMetadata(): Record<string, any> { return this.props.academicMetadata; }

  transferToGrade(newGradeId: string): void {
    this.props.gradeId = newGradeId;
  }
}

export interface TeacherProfileProps {
  userId: string;
  teacherCode: TeacherCode;
  bio?: string | null;
  specialties: string[];
  employmentMetadata: Record<string, any>;
}

export class TeacherProfile extends AggregateRoot<TeacherProfileProps> {
  get userId(): string { return this.props.userId; }
  get teacherCode(): TeacherCode { return this.props.teacherCode; }
  get bio(): string | null { return this.props.bio || null; }
  get specialties(): string[] { return this.props.specialties; }
  get employmentMetadata(): Record<string, any> { return this.props.employmentMetadata; }
}

export interface EnrollmentProps {
  studentId: string;
  academicYearId: string;
  sectionId?: string | null;
  enrollmentNumber: EnrollmentNumber;
  status: 'ENROLLED' | 'COMPLETED' | 'DROPPED';
  enrolledAt: Date;
}

export class Enrollment extends AggregateRoot<EnrollmentProps> {
  get studentId(): string { return this.props.studentId; }
  get academicYearId(): string { return this.props.academicYearId; }
  get sectionId(): string | null { return this.props.sectionId || null; }
  get enrollmentNumber(): EnrollmentNumber { return this.props.enrollmentNumber; }
  get status(): string { return this.props.status; }
  get enrolledAt(): Date { return this.props.enrolledAt; }

  assignSection(sectionId: string): void {
    this.props.sectionId = sectionId;
  }
}

export interface GuardianProps {
  userId: string;
  relation: string;
  studentIds: string[];
}

export class Guardian extends AggregateRoot<GuardianProps> {
  get userId(): string { return this.props.userId; }
  get relation(): string { return this.props.relation; }
  get studentIds(): string[] { return this.props.studentIds; }

  linkStudent(studentId: string): void {
    if (!this.props.studentIds.includes(studentId)) {
      this.props.studentIds.push(studentId);
    }
  }
}

// ==========================================
// Sprint 16 Student Success Aggregates
// ==========================================

export interface StudentSuccessProfileProps {
  tenantId: string;
  studentId: string;
  successScore: number;
  engagementScore: number;
  customFormula: string;
  graduationReady: boolean;
}

export class StudentSuccessProfile extends AggregateRoot<StudentSuccessProfileProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get successScore(): number { return this.props.successScore; }
  get engagementScore(): number { return this.props.engagementScore; }
  get customFormula(): string { return this.props.customFormula; }
  get graduationReady(): boolean { return this.props.graduationReady; }
}

export interface AcademicRiskAssessmentProps {
  tenantId: string;
  studentId: string;
  riskLevel: string;
  attendanceRisk: number;
  gradesRisk: number;
  financialRisk: number;
}

export class AcademicRiskAssessment extends AggregateRoot<AcademicRiskAssessmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get riskLevel(): string { return this.props.riskLevel; }
  get attendanceRisk(): number { return this.props.attendanceRisk; }
  get gradesRisk(): number { return this.props.gradesRisk; }
  get financialRisk(): number { return this.props.financialRisk; }
}

export interface AdvisorAssignmentProps {
  tenantId: string;
  studentId: string;
  advisorId: string;
  status: string;
}

export class AdvisorAssignment extends AggregateRoot<AdvisorAssignmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get advisorId(): string { return this.props.advisorId; }
  get status(): string { return this.props.status; }
}

export interface AdvisorNoteProps {
  tenantId: string;
  studentId: string;
  advisorId: string;
  noteContent: string;
}

export class AdvisorNote extends AggregateRoot<AdvisorNoteProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get advisorId(): string { return this.props.advisorId; }
  get noteContent(): string { return this.props.noteContent; }
}

export interface InterventionPlanProps {
  tenantId: string;
  studentId: string;
  assignedTo: string;
  description: string;
  slaDeadline: Date;
  escalationLevel: string;
  status: string;
}

export class InterventionPlan extends AggregateRoot<InterventionPlanProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get assignedTo(): string { return this.props.assignedTo; }
  get description(): string { return this.props.description; }
  get slaDeadline(): Date { return this.props.slaDeadline; }
  get escalationLevel(): string { return this.props.escalationLevel; }
  get status(): string { return this.props.status; }
}

export interface StudentJourneyProps {
  tenantId: string;
  studentId: string;
  milestone: string;
  category: string;
}

export class StudentJourney extends AggregateRoot<StudentJourneyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get milestone(): string { return this.props.milestone; }
  get category(): string { return this.props.category; }
}

export interface CareerProfileProps {
  tenantId: string;
  studentId: string;
  employabilityScore: number;
  skillGapJson: any;
}

export class CareerProfile extends AggregateRoot<CareerProfileProps> {
  get tenantId(): string { return this.props.tenantId; }
  get studentId(): string { return this.props.studentId; }
  get employabilityScore(): number { return this.props.employabilityScore; }
  get skillGapJson(): any { return this.props.skillGapJson; }
}
