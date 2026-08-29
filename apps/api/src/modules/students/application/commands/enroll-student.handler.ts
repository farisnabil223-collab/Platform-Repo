import { BadRequestException, Injectable } from '@nestjs/common';
import {
  StudentProfileRepository,
  AcademicYearRepository,
  EnrollmentRepository,
  SectionRepository,
  prisma
} from '@eduverse/database';
import {
  Enrollment,
  EnrollmentNumber,
  EnrollmentEligibilitySpecification,
  AcademicIntegrityPolicy,
  generateUuidV7,
  StudentEnrolled,
  DomainEventBus
} from '@eduverse/kernel';
import { EnrollStudentDto } from '../../dto/enroll-student.dto';

@Injectable()
export class EnrollStudentHandler {
  constructor(
    private readonly studentProfileRepository: StudentProfileRepository,
    private readonly academicYearRepository: AcademicYearRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly sectionRepository: SectionRepository
  ) {}

  async execute(dto: EnrollStudentDto): Promise<Enrollment> {
    const student = await this.studentProfileRepository.findById(dto.studentId);
    if (!student) {
      throw new BadRequestException('Student Profile not found');
    }

    const year = await this.academicYearRepository.findById(dto.academicYearId);
    if (!year) {
      throw new BadRequestException('Academic Year not found');
    }

    if (year.status !== 'ACTIVE' && year.status !== 'UPCOMING') {
      throw new BadRequestException('Enrollment can only occur during ACTIVE or UPCOMING academic years');
    }

    const section = await this.sectionRepository.findById(dto.sectionId);
    if (!section) {
      throw new BadRequestException('Section not found');
    }

    // 1. Enrollment Eligibility checks
    await EnrollmentEligibilitySpecification.isSatisfiedBy(student, year.id, this.enrollmentRepository);

    // 2. Classroom capacity checks
    const activeCount = await prisma.studentEnrollment.count({
      where: { sectionId: dto.sectionId, status: 'ENROLLED' },
    });
    const classroom = await prisma.classroom.findUnique({
      where: { id: section.classroomId },
    });
    const capacity = classroom?.capacity || 30;

    AcademicIntegrityPolicy.validateSectionCapacity(activeCount, capacity);

    // 3. Generate EnrollmentNumber value object
    const startYear = year.startDate.getFullYear();
    const count = await prisma.studentEnrollment.count();
    const countStr = String(count + 1).padStart(6, '0');
    const enrollmentNum = new EnrollmentNumber(`ENR_${startYear}_${countStr}`);

    // 4. Save aggregate
    const enrollment = new Enrollment(generateUuidV7(), {
      studentId: student.id,
      academicYearId: year.id,
      sectionId: section.id,
      enrollmentNumber: enrollmentNum,
      status: 'ENROLLED',
      enrolledAt: new Date(),
    });

    await this.enrollmentRepository.save(enrollment);

    // 5. Update student profile grade to match section grade
    student.transferToGrade(section.gradeId);
    await this.studentProfileRepository.save(student);

    // 6. Publish event
    await DomainEventBus.getInstance().publish(new StudentEnrolled(student.id, year.id, enrollmentNum.value));

    return enrollment;
  }
}
