import { User } from './user.aggregate';
import { Session } from './session.aggregate';
import { Device } from './device.aggregate';
import { Role } from './role.aggregate';
import {
  Grade,
  Classroom,
  Section,
  Subject,
  AcademicYear,
  TeacherProfile,
  StudentProfile,
  Enrollment,
  Guardian
} from './academic-aggregates';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
}

export interface ISessionRepository extends IBaseRepository<Session> {
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  revokeAllUserSessions(userId: string): Promise<void>;
}

export interface IDeviceRepository extends IBaseRepository<Device> {
  findByUserIdAndHash(userId: string, deviceHash: string): Promise<Device | null>;
  findByUserId(userId: string): Promise<Device[]>;
}

export interface IRoleRepository extends IBaseRepository<Role> {
  findByName(name: string): Promise<Role | null>;
}

export interface IGradeRepository extends IBaseRepository<Grade> {
  findByLevel(level: string): Promise<Grade | null>;
}

export interface IClassroomRepository extends IBaseRepository<Classroom> {
  findByCode(code: string): Promise<Classroom | null>;
}

export interface ISectionRepository extends IBaseRepository<Section> {
  findByCode(code: string): Promise<Section | null>;
  findByGradeId(gradeId: string): Promise<Section[]>;
  findByClassroomId(classroomId: string): Promise<Section[]>;
}

export interface ISubjectRepository extends IBaseRepository<Subject> {
  findByCode(code: string): Promise<Subject | null>;
  findByGradeId(gradeId: string): Promise<Subject[]>;
}

export interface IAcademicYearRepository extends IBaseRepository<AcademicYear> {
  findByName(name: string): Promise<AcademicYear | null>;
  findActiveYear(): Promise<AcademicYear | null>;
}

export interface ITeacherProfileRepository extends IBaseRepository<TeacherProfile> {
  findByTeacherCode(code: string): Promise<TeacherProfile | null>;
  findByUserId(userId: string): Promise<TeacherProfile | null>;
}

export interface IStudentProfileRepository extends IBaseRepository<StudentProfile> {
  findByStudentCode(code: string): Promise<StudentProfile | null>;
  findByUserId(userId: string): Promise<StudentProfile | null>;
}

export interface IEnrollmentRepository extends IBaseRepository<Enrollment> {
  findByEnrollmentNumber(num: string): Promise<Enrollment | null>;
  findActiveEnrollment(studentId: string, academicYearId: string): Promise<Enrollment | null>;
}

export interface IGuardianRepository extends IBaseRepository<Guardian> {
  findByUserId(userId: string): Promise<Guardian | null>;
}

import {
  Course,
  CourseVersion,
  Module,
  Lesson,
  LearningContent,
  MediaAsset,
  CourseProgress,
  LessonProgress,
  Quiz,
  Assignment
} from './learning-aggregates';

export interface ICourseRepository extends IBaseRepository<Course> {
  findByCode(code: string): Promise<Course | null>;
  findBySlug(slug: string): Promise<Course | null>;
}

export interface ICourseVersionRepository extends IBaseRepository<CourseVersion> {
  findByVersionNum(courseId: string, semver: string): Promise<CourseVersion | null>;
  findActiveVersion(courseId: string): Promise<CourseVersion | null>;
}

export interface IModuleRepository extends IBaseRepository<Module> {
  findByCode(code: string): Promise<Module | null>;
  findByCourseId(courseId: string): Promise<Module[]>;
}

export interface ILessonRepository extends IBaseRepository<Lesson> {
  findByCode(code: string): Promise<Lesson | null>;
  findByModuleId(moduleId: string): Promise<Lesson[]>;
}

export interface ILearningContentRepository extends IBaseRepository<LearningContent> {
  findByLessonId(lessonId: string): Promise<LearningContent[]>;
}

export interface IMediaAssetRepository extends IBaseRepository<MediaAsset> {
  findByStoragePath(path: string): Promise<MediaAsset | null>;
}

export interface ICourseProgressRepository extends IBaseRepository<CourseProgress> {
  findByStudentAndCourse(studentId: string, courseId: string): Promise<CourseProgress | null>;
}

export interface ILessonProgressRepository extends IBaseRepository<LessonProgress> {
  findByStudentAndLesson(studentId: string, lessonId: string): Promise<LessonProgress | null>;
}

export interface IQuizRepository extends IBaseRepository<Quiz> {}

export interface IAssignmentRepository extends IBaseRepository<Assignment> {}

import {
  Assessment,
  Question,
  QuestionBank,
  AssessmentAttempt,
  AssessmentResult
} from './assessment-aggregates';

export interface IAssessmentRepository extends IBaseRepository<Assessment> {
  findByCode(code: string): Promise<Assessment | null>;
}

export interface IAssessmentAttemptRepository extends IBaseRepository<AssessmentAttempt> {
  findByStudentAndAssessment(studentId: string, assessmentId: string, attemptNum: number): Promise<AssessmentAttempt | null>;
}

export interface IQuestionRepository extends IBaseRepository<Question> {
  findByCode(code: string): Promise<Question | null>;
}

export interface IQuestionBankRepository extends IBaseRepository<QuestionBank> {}

export interface IAssessmentResultRepository extends IBaseRepository<AssessmentResult> {
  findByAttemptId(attemptId: string): Promise<AssessmentResult | null>;
}

import {
  Notification,
  Announcement,
  Conversation,
  Message,
  LiveEvent
} from './communication-aggregates';

export interface INotificationRepository extends IBaseRepository<Notification> {}
export interface IAnnouncementRepository extends IBaseRepository<Announcement> {
  findByCode(code: string): Promise<Announcement | null>;
}
export interface IConversationRepository extends IBaseRepository<Conversation> {}
export interface IMessageRepository extends IBaseRepository<Message> {}
export interface ILiveEventRepository extends IBaseRepository<LiveEvent> {
  findByCode(code: string): Promise<LiveEvent | null>;
}

import {
  Certificate,
  CertificateTemplate,
  IssuerOrganization,
  CredentialWallet,
  RevocationRecord,
  CredentialShare
} from './credential-aggregates';

export interface ICertificateRepository extends IBaseRepository<Certificate> {
  findByCode(code: string): Promise<Certificate | null>;
  findByVerificationCode(code: string): Promise<Certificate | null>;
}
export interface ICertificateTemplateRepository extends IBaseRepository<CertificateTemplate> {
  findByCode(code: string): Promise<CertificateTemplate | null>;
}
export interface IIssuerOrganizationRepository extends IBaseRepository<IssuerOrganization> {
  findByCode(code: string): Promise<IssuerOrganization | null>;
}
export interface ICredentialWalletRepository extends IBaseRepository<CredentialWallet> {
  findByStudentId(studentId: string): Promise<CredentialWallet | null>;
}
export interface IRevocationRecordRepository extends IBaseRepository<RevocationRecord> {
  findByCertificateId(certificateId: string): Promise<RevocationRecord | null>;
}
export interface ICredentialShareRepository extends IBaseRepository<CredentialShare> {
  findByShareToken(token: string): Promise<CredentialShare | null>;
}

