import { AggregateRoot } from './aggregate-root';

export interface AlumniProfileProps {
  tenantId: string;
  userId: string;
  graduationYear: number;
  verificationState: string;
  chapterName: string;
}

export class AlumniProfile extends AggregateRoot<AlumniProfileProps> {
  constructor(id: string, props: AlumniProfileProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get graduationYear(): number { return this.props.graduationYear; }
  get verificationState(): string { return this.props.verificationState; }
  get chapterName(): string { return this.props.chapterName; }
}

export interface AlumniChapterLeaderProps {
  tenantId: string;
  chapterId: string;
  userId: string;
  role: string;
}

export class AlumniChapterLeader extends AggregateRoot<AlumniChapterLeaderProps> {
  constructor(id: string, props: AlumniChapterLeaderProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get chapterId(): string { return this.props.chapterId; }
  get userId(): string { return this.props.userId; }
  get role(): string { return this.props.role; }
}

export interface CareerResumeProps {
  tenantId: string;
  userId: string;
  fileUrl: string;
  version: number;
}

export class CareerResume extends AggregateRoot<CareerResumeProps> {
  constructor(id: string, props: CareerResumeProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get fileUrl(): string { return this.props.fileUrl; }
  get versionNumber(): number { return this.props.version; }
}

export interface EmployerAccountProps {
  tenantId: string;
  companyName: string;
  industry: string;
  website: string;
}

export class EmployerAccount extends AggregateRoot<EmployerAccountProps> {
  constructor(id: string, props: EmployerAccountProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get companyName(): string { return this.props.companyName; }
  get industry(): string { return this.props.industry; }
  get website(): string { return this.props.website; }
}

export interface JobPostingProps {
  tenantId: string;
  employerId: string;
  title: string;
  salary: number;
  status: string;
}

export class JobPosting extends AggregateRoot<JobPostingProps> {
  constructor(id: string, props: JobPostingProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get employerId(): string { return this.props.employerId; }
  get title(): string { return this.props.title; }
  get salary(): number { return this.props.salary; }
  get status(): string { return this.props.status; }
}

export interface JobApplicationProps {
  tenantId: string;
  jobPostingId: string;
  userId: string;
  pipelineStep: string;
}

export class JobApplication extends AggregateRoot<JobApplicationProps> {
  constructor(id: string, props: JobApplicationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get jobPostingId(): string { return this.props.jobPostingId; }
  get userId(): string { return this.props.userId; }
  get pipelineStep(): string { return this.props.pipelineStep; }
}

export interface MentorshipProgramProps {
  tenantId: string;
  mentorId: string;
  studentId: string;
  status: string;
}

export class MentorshipProgram extends AggregateRoot<MentorshipProgramProps> {
  constructor(id: string, props: MentorshipProgramProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get mentorId(): string { return this.props.mentorId; }
  get studentId(): string { return this.props.studentId; }
  get status(): string { return this.props.status; }
}

export interface MentorshipSessionProps {
  tenantId: string;
  mentorId: string;
  studentId: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: string;
}

export class MentorshipSession extends AggregateRoot<MentorshipSessionProps> {
  constructor(id: string, props: MentorshipSessionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get mentorId(): string { return this.props.mentorId; }
  get studentId(): string { return this.props.studentId; }
  get startTime(): Date { return this.props.startTime; }
  get endTime(): Date { return this.props.endTime; }
  get notes(): string | undefined { return this.props.notes; }
  get status(): string { return this.props.status; }
}

export interface CommunityPostProps {
  tenantId: string;
  userId: string;
  content: string;
  isBlocked: boolean;
}

export class CommunityPost extends AggregateRoot<CommunityPostProps> {
  constructor(id: string, props: CommunityPostProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get content(): string { return this.props.content; }
  get isBlocked(): boolean { return this.props.isBlocked; }
}

export interface CrmContactProps {
  tenantId: string;
  name: string;
  email: string;
}

export class CrmContact extends AggregateRoot<CrmContactProps> {
  constructor(id: string, props: CrmContactProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
}

export interface AlumniEventProps {
  tenantId: string;
  title: string;
  eventDate: Date;
}

export class AlumniEvent extends AggregateRoot<AlumniEventProps> {
  constructor(id: string, props: AlumniEventProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get eventDate(): Date { return this.props.eventDate; }
}

export interface EventRegistrationProps {
  tenantId: string;
  eventId: string;
  userId: string;
  attended: boolean;
}

export class EventRegistration extends AggregateRoot<EventRegistrationProps> {
  constructor(id: string, props: EventRegistrationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get eventId(): string { return this.props.eventId; }
  get userId(): string { return this.props.userId; }
  get attended(): boolean { return this.props.attended; }
}

export interface DonationCampaignProps {
  tenantId: string;
  title: string;
  targetGoal: number;
  raisedAmt: number;
}

export class DonationCampaign extends AggregateRoot<DonationCampaignProps> {
  constructor(id: string, props: DonationCampaignProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get targetGoal(): number { return this.props.targetGoal; }
  get raisedAmt(): number { return this.props.raisedAmt; }
}

export interface DonationTransactionProps {
  tenantId: string;
  campaignId: string;
  donorId: string;
  amount: number;
  isRecurring: boolean;
}

export class DonationTransaction extends AggregateRoot<DonationTransactionProps> {
  constructor(id: string, props: DonationTransactionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get campaignId(): string { return this.props.campaignId; }
  get donorId(): string { return this.props.donorId; }
  get amount(): number { return this.props.amount; }
  get isRecurring(): boolean { return this.props.isRecurring; }
}
