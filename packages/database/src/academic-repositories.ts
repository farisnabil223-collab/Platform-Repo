import {
  IGradeRepository,
  IClassroomRepository,
  ISectionRepository,
  ISubjectRepository,
  IAcademicYearRepository,
  ITeacherProfileRepository,
  IStudentProfileRepository,
  IEnrollmentRepository,
  IGuardianRepository,
  Grade,
  Classroom,
  Section,
  Subject,
  AcademicYear,
  TeacherProfile,
  StudentProfile,
  Enrollment,
  Guardian,
  GradeLevel,
  SubjectCode,
  AcademicYearCode,
  StudentCode,
  TeacherCode,
  EnrollmentNumber,
  StudentSuccessProfile,
  AcademicRiskAssessment,
  AdvisorAssignment,
  AdvisorNote,
  InterventionPlan,
  StudentJourney,
  CareerProfile
} from '@eduverse/kernel';
import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';

export class GradeRepository implements IGradeRepository {
  async findById(id: string): Promise<Grade | null> {
    const row = await prisma.grade.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Grade(row.id, {
      level: new GradeLevel(row.level),
      name: row.name,
      description: row.description,
    }, row.version);
  }

  async findByLevel(level: string): Promise<Grade | null> {
    const row = await prisma.grade.findFirst({ where: { level: level.toUpperCase(), deletedAt: null } });
    if (!row) return null;
    return new Grade(row.id, {
      level: new GradeLevel(row.level),
      name: row.name,
      description: row.description,
    }, row.version);
  }

  async findAll(): Promise<Grade[]> {
    const rows = await prisma.grade.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new Grade(r.id, {
      level: new GradeLevel(r.level),
      name: r.name,
      description: r.description,
    }, r.version));
  }

  async save(entity: Grade): Promise<void> {
    const data = {
      level: entity.level.value,
      name: entity.name,
      description: entity.description,
      version: { increment: 1 },
    };
    await prisma.grade.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.grade.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class ClassroomRepository implements IClassroomRepository {
  async findById(id: string): Promise<Classroom | null> {
    const row = await prisma.classroom.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Classroom(row.id, {
      name: row.name,
      code: row.code,
      capacity: row.capacity,
    }, row.version);
  }

  async findByCode(code: string): Promise<Classroom | null> {
    const row = await prisma.classroom.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Classroom(row.id, {
      name: row.name,
      code: row.code,
      capacity: row.capacity,
    }, row.version);
  }

  async findAll(): Promise<Classroom[]> {
    const rows = await prisma.classroom.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new Classroom(r.id, {
      name: r.name,
      code: r.code,
      capacity: r.capacity,
    }, r.version));
  }

  async save(entity: Classroom): Promise<void> {
    const data = {
      name: entity.name,
      code: entity.code,
      capacity: entity.capacity,
      version: { increment: 1 },
    };
    await prisma.classroom.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.classroom.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class SectionRepository implements ISectionRepository {
  async findById(id: string): Promise<Section | null> {
    const row = await prisma.section.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Section(row.id, {
      name: row.name,
      code: row.code,
      gradeId: row.gradeId,
      classroomId: row.classroomId,
    }, row.version);
  }

  async findByCode(code: string): Promise<Section | null> {
    const row = await prisma.section.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Section(row.id, {
      name: row.name,
      code: row.code,
      gradeId: row.gradeId,
      classroomId: row.classroomId,
    }, row.version);
  }

  async findByGradeId(gradeId: string): Promise<Section[]> {
    const rows = await prisma.section.findMany({ where: { gradeId, deletedAt: null } });
    return rows.map((r: any) => new Section(r.id, {
      name: r.name,
      code: r.code,
      gradeId: r.gradeId,
      classroomId: r.classroomId,
    }, r.version));
  }

  async findByClassroomId(classroomId: string): Promise<Section[]> {
    const rows = await prisma.section.findMany({ where: { classroomId, deletedAt: null } });
    return rows.map((r: any) => new Section(r.id, {
      name: r.name,
      code: r.code,
      gradeId: r.gradeId,
      classroomId: r.classroomId,
    }, r.version));
  }

  async findAll(): Promise<Section[]> {
    const rows = await prisma.section.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new Section(r.id, {
      name: r.name,
      code: r.code,
      gradeId: r.gradeId,
      classroomId: r.classroomId,
    }, r.version));
  }

  async save(entity: Section): Promise<void> {
    const data = {
      name: entity.name,
      code: entity.code,
      gradeId: entity.gradeId,
      classroomId: entity.classroomId,
      version: { increment: 1 },
    };
    await prisma.section.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.section.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class SubjectRepository implements ISubjectRepository {
  async findById(id: string): Promise<Subject | null> {
    const row = await prisma.subject.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Subject(row.id, {
      code: new SubjectCode(row.code),
      name: row.name,
      description: row.description,
      creditHours: row.creditHours,
      weeklyHours: row.weeklyHours,
      isElective: row.isElective,
      isActive: row.isActive,
      gradeId: row.gradeId,
    }, row.version);
  }

  async findByCode(code: string): Promise<Subject | null> {
    const row = await prisma.subject.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Subject(row.id, {
      code: new SubjectCode(row.code),
      name: row.name,
      description: row.description,
      creditHours: row.creditHours,
      weeklyHours: row.weeklyHours,
      isElective: row.isElective,
      isActive: row.isActive,
      gradeId: row.gradeId,
    }, row.version);
  }

  async findByGradeId(gradeId: string): Promise<Subject[]> {
    const rows = await prisma.subject.findMany({ where: { gradeId, deletedAt: null } });
    return rows.map((r: any) => new Subject(r.id, {
      code: new SubjectCode(r.code),
      name: r.name,
      description: r.description,
      creditHours: r.creditHours,
      weeklyHours: r.weeklyHours,
      isElective: r.isElective,
      isActive: r.isActive,
      gradeId: r.gradeId,
    }, r.version));
  }

  async findAll(): Promise<Subject[]> {
    const rows = await prisma.subject.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new Subject(r.id, {
      code: new SubjectCode(r.code),
      name: r.name,
      description: r.description,
      creditHours: r.creditHours,
      weeklyHours: r.weeklyHours,
      isElective: r.isElective,
      isActive: r.isActive,
      gradeId: r.gradeId,
    }, r.version));
  }

  async save(entity: Subject): Promise<void> {
    const data = {
      code: entity.code.value,
      name: entity.name,
      description: entity.description,
      creditHours: entity.creditHours,
      weeklyHours: entity.weeklyHours,
      isElective: entity.isElective,
      isActive: entity.isActive,
      gradeId: entity.gradeId,
      version: { increment: 1 },
    };
    await prisma.subject.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class AcademicYearRepository implements IAcademicYearRepository {
  async findById(id: string): Promise<AcademicYear | null> {
    const row = await prisma.academicYear.findFirst({
      where: { id, deletedAt: null },
      include: { terms: true },
    });
    if (!row) return null;
    return new AcademicYear(row.id, {
      name: new AcademicYearCode(row.name),
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      terms: row.terms.map((t: any) => ({
        id: t.id,
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        sortOrder: t.sortOrder,
        isActive: t.isActive,
      })),
    }, row.version);
  }

  async findByName(name: string): Promise<AcademicYear | null> {
    const row = await prisma.academicYear.findFirst({
      where: { name, deletedAt: null },
      include: { terms: true },
    });
    if (!row) return null;
    return new AcademicYear(row.id, {
      name: new AcademicYearCode(row.name),
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      terms: row.terms.map((t: any) => ({
        id: t.id,
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        sortOrder: t.sortOrder,
        isActive: t.isActive,
      })),
    }, row.version);
  }

  async findActiveYear(): Promise<AcademicYear | null> {
    const row = await prisma.academicYear.findFirst({
      where: { status: 'ACTIVE', deletedAt: null },
      include: { terms: true },
    });
    if (!row) return null;
    return new AcademicYear(row.id, {
      name: new AcademicYearCode(row.name),
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      terms: row.terms.map((t: any) => ({
        id: t.id,
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        sortOrder: t.sortOrder,
        isActive: t.isActive,
      })),
    }, row.version);
  }

  async findAll(): Promise<AcademicYear[]> {
    const rows = await prisma.academicYear.findMany({
      where: { deletedAt: null },
      include: { terms: true },
    });
    return rows.map((r: any) => new AcademicYear(r.id, {
      name: new AcademicYearCode(r.name),
      startDate: r.startDate,
      endDate: r.endDate,
      status: r.status,
      terms: r.terms.map((t: any) => ({
        id: t.id,
        name: t.name,
        startDate: t.startDate,
        endDate: t.endDate,
        sortOrder: t.sortOrder,
        isActive: t.isActive,
      })),
    }, r.version));
  }

  async save(entity: AcademicYear): Promise<void> {
    const data = {
      name: entity.name.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      version: { increment: 1 },
    };
    await prisma.academicYear.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });

    // Handle term child updates
    for (const t of entity.terms) {
      await prisma.academicTerm.upsert({
        where: { id: t.id },
        create: {
          id: t.id,
          academicYearId: entity.id,
          name: t.name,
          startDate: t.startDate,
          endDate: t.endDate,
          sortOrder: t.sortOrder,
          isActive: t.isActive,
        },
        update: {
          name: t.name,
          startDate: t.startDate,
          endDate: t.endDate,
          sortOrder: t.sortOrder,
          isActive: t.isActive,
        },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.academicYear.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class TeacherProfileRepository implements ITeacherProfileRepository {
  async findById(id: string): Promise<TeacherProfile | null> {
    const row = await prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      include: { subjects: true },
    });
    if (!row) return null;
    return new TeacherProfile(row.id, {
      userId: row.userId,
      teacherCode: new TeacherCode(row.teacherCode),
      bio: row.bio,
      specialties: row.specialties,
      employmentMetadata: row.employmentMetadata as Record<string, any>,
    }, row.version);
  }

  async findByTeacherCode(code: string): Promise<TeacherProfile | null> {
    const row = await prisma.teacher.findFirst({
      where: { teacherCode: code, deletedAt: null },
    });
    if (!row) return null;
    return new TeacherProfile(row.id, {
      userId: row.userId,
      teacherCode: new TeacherCode(row.teacherCode),
      bio: row.bio,
      specialties: row.specialties,
      employmentMetadata: row.employmentMetadata as Record<string, any>,
    }, row.version);
  }

  async findByUserId(userId: string): Promise<TeacherProfile | null> {
    const row = await prisma.teacher.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!row) return null;
    return new TeacherProfile(row.id, {
      userId: row.userId,
      teacherCode: new TeacherCode(row.teacherCode),
      bio: row.bio,
      specialties: row.specialties,
      employmentMetadata: row.employmentMetadata as Record<string, any>,
    }, row.version);
  }

  async findAll(): Promise<TeacherProfile[]> {
    const rows = await prisma.teacher.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new TeacherProfile(r.id, {
      userId: r.userId,
      teacherCode: new TeacherCode(r.teacherCode),
      bio: r.bio,
      specialties: r.specialties,
      employmentMetadata: r.employmentMetadata as Record<string, any>,
    }, r.version));
  }

  async save(entity: TeacherProfile): Promise<void> {
    const data = {
      userId: entity.userId,
      teacherCode: entity.teacherCode.value,
      bio: entity.bio,
      specialties: entity.specialties,
      employmentMetadata: entity.employmentMetadata,
      version: { increment: 1 },
    };
    await prisma.teacher.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.teacher.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class StudentProfileRepository implements IStudentProfileRepository {
  async findById(id: string): Promise<StudentProfile | null> {
    const row = await prisma.student.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new StudentProfile(row.id, {
      userId: row.userId,
      studentCode: new StudentCode(row.studentCode),
      gradeId: row.gradeId,
      status: row.status as any,
      academicMetadata: row.academicMetadata as Record<string, any>,
    }, row.version);
  }

  async findByStudentCode(code: string): Promise<StudentProfile | null> {
    const row = await prisma.student.findFirst({ where: { studentCode: code, deletedAt: null } });
    if (!row) return null;
    return new StudentProfile(row.id, {
      userId: row.userId,
      studentCode: new StudentCode(row.studentCode),
      gradeId: row.gradeId,
      status: row.status as any,
      academicMetadata: row.academicMetadata as Record<string, any>,
    }, row.version);
  }

  async findByUserId(userId: string): Promise<StudentProfile | null> {
    const row = await prisma.student.findFirst({ where: { userId, deletedAt: null } });
    if (!row) return null;
    return new StudentProfile(row.id, {
      userId: row.userId,
      studentCode: new StudentCode(row.studentCode),
      gradeId: row.gradeId,
      status: row.status as any,
      academicMetadata: row.academicMetadata as Record<string, any>,
    }, row.version);
  }

  async findAll(): Promise<StudentProfile[]> {
    const rows = await prisma.student.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new StudentProfile(r.id, {
      userId: r.userId,
      studentCode: new StudentCode(r.studentCode),
      gradeId: r.gradeId,
      status: r.status as any,
      academicMetadata: r.academicMetadata as Record<string, any>,
    }, r.version));
  }

  async save(entity: StudentProfile): Promise<void> {
    const data = {
      userId: entity.userId,
      studentCode: entity.studentCode.value,
      gradeId: entity.gradeId,
      status: entity.status,
      academicMetadata: entity.academicMetadata,
      version: { increment: 1 },
    };
    await prisma.student.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class EnrollmentRepository implements IEnrollmentRepository {
  async findById(id: string): Promise<Enrollment | null> {
    const row = await prisma.studentEnrollment.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Enrollment(row.id, {
      studentId: row.studentId,
      academicYearId: row.academicYearId,
      sectionId: row.sectionId,
      enrollmentNumber: new EnrollmentNumber(row.enrollmentNumber),
      status: row.status as any,
      enrolledAt: row.enrolledAt,
    }, row.version);
  }

  async findByEnrollmentNumber(num: string): Promise<Enrollment | null> {
    const row = await prisma.studentEnrollment.findFirst({ where: { enrollmentNumber: num, deletedAt: null } });
    if (!row) return null;
    return new Enrollment(row.id, {
      studentId: row.studentId,
      academicYearId: row.academicYearId,
      sectionId: row.sectionId,
      enrollmentNumber: new EnrollmentNumber(row.enrollmentNumber),
      status: row.status as any,
      enrolledAt: row.enrolledAt,
    }, row.version);
  }

  async findActiveEnrollment(studentId: string, academicYearId: string): Promise<Enrollment | null> {
    const row = await prisma.studentEnrollment.findFirst({
      where: { studentId, academicYearId, status: 'ENROLLED', deletedAt: null },
    });
    if (!row) return null;
    return new Enrollment(row.id, {
      studentId: row.studentId,
      academicYearId: row.academicYearId,
      sectionId: row.sectionId,
      enrollmentNumber: new EnrollmentNumber(row.enrollmentNumber),
      status: row.status as any,
      enrolledAt: row.enrolledAt,
    }, row.version);
  }

  async findAll(): Promise<Enrollment[]> {
    const rows = await prisma.studentEnrollment.findMany({ where: { deletedAt: null } });
    return rows.map((r: any) => new Enrollment(r.id, {
      studentId: r.studentId,
      academicYearId: r.academicYearId,
      sectionId: r.sectionId,
      enrollmentNumber: new EnrollmentNumber(r.enrollmentNumber),
      status: r.status as any,
      enrolledAt: r.enrolledAt,
    }, r.version));
  }

  async save(entity: Enrollment): Promise<void> {
    const data = {
      studentId: entity.studentId,
      academicYearId: entity.academicYearId,
      sectionId: entity.sectionId,
      enrollmentNumber: entity.enrollmentNumber.value,
      status: entity.status,
      enrolledAt: entity.enrolledAt,
      version: { increment: 1 },
    };
    await prisma.studentEnrollment.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.studentEnrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class GuardianRepository implements IGuardianRepository {
  async findById(id: string): Promise<Guardian | null> {
    const row = await prisma.guardian.findFirst({
      where: { id, deletedAt: null },
      include: { students: true },
    });
    if (!row) return null;
    return new Guardian(row.id, {
      userId: row.userId,
      relation: row.relation,
      studentIds: row.students.map((s: any) => s.studentId),
    }, row.version);
  }

  async findByUserId(userId: string): Promise<Guardian | null> {
    const row = await prisma.guardian.findFirst({
      where: { userId, deletedAt: null },
      include: { students: true },
    });
    if (!row) return null;
    return new Guardian(row.id, {
      userId: row.userId,
      relation: row.relation,
      studentIds: row.students.map((s: any) => s.studentId),
    }, row.version);
  }

  async findAll(): Promise<Guardian[]> {
    const rows = await prisma.guardian.findMany({
      where: { deletedAt: null },
      include: { students: true },
    });
    return rows.map((r: any) => new Guardian(r.id, {
      userId: r.userId,
      relation: r.relation,
      studentIds: r.students.map((s: any) => s.studentId),
    }, r.version));
  }

  async save(entity: Guardian): Promise<void> {
    const data = {
      userId: entity.userId,
      relation: entity.relation,
      version: { increment: 1 },
    };
    await prisma.guardian.upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data, version: 1 },
      update: data,
    });

    // Handle student mapping links
    await prisma.studentGuardian.deleteMany({ where: { guardianId: entity.id } });
    for (const studentId of entity.studentIds) {
      await prisma.studentGuardian.create({
        data: {
          guardianId: entity.id,
          studentId,
        },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.guardian.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class StudentSuccessProfileRepository extends BaseTenantRepository {
  async save(profile: StudentSuccessProfile): Promise<void> {
    await prisma.studentSuccessProfile.upsert({
      where: { id: profile.id },
      update: {
        successScore: profile.successScore,
        engagementScore: profile.engagementScore,
        customFormula: profile.customFormula,
        graduationReady: profile.graduationReady,
      },
      create: {
        id: profile.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: profile.studentId,
        successScore: profile.successScore,
        engagementScore: profile.engagementScore,
        customFormula: profile.customFormula,
        graduationReady: profile.graduationReady,
      },
    });
  }

  async findByStudentId(studentId: string): Promise<StudentSuccessProfile | null> {
    const row = await prisma.studentSuccessProfile.findFirst({
      where: { studentId, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new StudentSuccessProfile(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      successScore: row.successScore,
      engagementScore: row.engagementScore,
      customFormula: row.customFormula,
      graduationReady: row.graduationReady,
    });
  }
}

export class AcademicRiskAssessmentRepository extends BaseTenantRepository {
  async save(assessment: AcademicRiskAssessment): Promise<void> {
    await prisma.academicRiskAssessment.create({
      data: {
        id: assessment.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: assessment.studentId,
        riskLevel: assessment.riskLevel,
        attendanceRisk: assessment.attendanceRisk,
        gradesRisk: assessment.gradesRisk,
        financialRisk: assessment.financialRisk,
      },
    });
  }

  async findManyByStudentId(studentId: string): Promise<AcademicRiskAssessment[]> {
    const list = await prisma.academicRiskAssessment.findMany({
      where: { studentId, tenantId: this.getTenantIdOrThrow() },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((row: any) => new AcademicRiskAssessment(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      riskLevel: row.riskLevel,
      attendanceRisk: row.attendanceRisk,
      gradesRisk: row.gradesRisk,
      financialRisk: row.financialRisk,
    }));
  }
}

export class AdvisorAssignmentRepository extends BaseTenantRepository {
  async save(assignment: AdvisorAssignment): Promise<void> {
    await prisma.advisorAssignment.upsert({
      where: { id: assignment.id },
      update: { status: assignment.status },
      create: {
        id: assignment.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: assignment.studentId,
        advisorId: assignment.advisorId,
        status: assignment.status,
      },
    });
  }

  async findManyByAdvisorId(advisorId: string): Promise<AdvisorAssignment[]> {
    const list = await prisma.advisorAssignment.findMany({
      where: { advisorId, tenantId: this.getTenantIdOrThrow() },
    });
    return list.map((row: any) => new AdvisorAssignment(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      advisorId: row.advisorId,
      status: row.status,
    }));
  }
}

export class AdvisorNoteRepository extends BaseTenantRepository {
  async save(note: AdvisorNote): Promise<void> {
    await prisma.advisorNote.create({
      data: {
        id: note.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: note.studentId,
        advisorId: note.advisorId,
        noteContent: note.noteContent,
      },
    });
  }

  async findManyByStudentId(studentId: string): Promise<AdvisorNote[]> {
    const list = await prisma.advisorNote.findMany({
      where: { studentId, tenantId: this.getTenantIdOrThrow() },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((row: any) => new AdvisorNote(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      advisorId: row.advisorId,
      noteContent: row.noteContent,
    }));
  }
}

export class InterventionPlanRepository extends BaseTenantRepository {
  async save(plan: InterventionPlan): Promise<void> {
    await prisma.interventionPlan.upsert({
      where: { id: plan.id },
      update: {
        status: plan.status,
        escalationLevel: plan.escalationLevel,
      },
      create: {
        id: plan.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: plan.studentId,
        assignedTo: plan.assignedTo,
        description: plan.description,
        slaDeadline: plan.slaDeadline,
        escalationLevel: plan.escalationLevel,
        status: plan.status,
      },
    });
  }

  async findManyByStudentId(studentId: string): Promise<InterventionPlan[]> {
    const list = await prisma.interventionPlan.findMany({
      where: { studentId, tenantId: this.getTenantIdOrThrow() },
    });
    return list.map((row: any) => new InterventionPlan(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      assignedTo: row.assignedTo,
      description: row.description,
      slaDeadline: row.slaDeadline,
      escalationLevel: row.escalationLevel,
      status: row.status,
    }));
  }
}

export class StudentJourneyRepository extends BaseTenantRepository {
  async save(journey: StudentJourney): Promise<void> {
    await prisma.studentJourney.create({
      data: {
        id: journey.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: journey.studentId,
        milestone: journey.milestone,
        category: journey.category,
      },
    });
  }

  async findManyByStudentId(studentId: string): Promise<StudentJourney[]> {
    const list = await prisma.studentJourney.findMany({
      where: { studentId, tenantId: this.getTenantIdOrThrow() },
      orderBy: { occurredAt: 'desc' },
    });
    return list.map((row: any) => new StudentJourney(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      milestone: row.milestone,
      category: row.category,
    }));
  }
}

export class CareerProfileRepository extends BaseTenantRepository {
  async save(profile: CareerProfile): Promise<void> {
    await prisma.careerProfile.upsert({
      where: { id: profile.id },
      update: {
        employabilityScore: profile.employabilityScore,
        skillGapJson: profile.skillGapJson,
      },
      create: {
        id: profile.id,
        tenantId: this.getTenantIdOrThrow(),
        studentId: profile.studentId,
        employabilityScore: profile.employabilityScore,
        skillGapJson: profile.skillGapJson,
      },
    });
  }

  async findByStudentId(studentId: string): Promise<CareerProfile | null> {
    const row = await prisma.careerProfile.findFirst({
      where: { studentId, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new CareerProfile(row.id, {
      tenantId: row.tenantId,
      studentId: row.studentId,
      employabilityScore: row.employabilityScore,
      skillGapJson: row.skillGapJson,
    });
  }
}
