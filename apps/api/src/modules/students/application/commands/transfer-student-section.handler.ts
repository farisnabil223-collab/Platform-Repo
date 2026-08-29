import { BadRequestException, Injectable } from '@nestjs/common';
import { SectionRepository, EnrollmentRepository, prisma } from '@eduverse/database';
import { AcademicIntegrityPolicy, StudentTransferred, DomainEventBus } from '@eduverse/kernel';
import { TransferStudentDto } from '../../dto/transfer-student.dto';

@Injectable()
export class TransferStudentSectionHandler {
  constructor(
    private readonly sectionRepository: SectionRepository,
    private readonly enrollmentRepository: EnrollmentRepository
  ) {}

  async execute(enrollmentId: string, dto: TransferStudentDto): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new BadRequestException('Active enrollment not found');
    }

    const toSection = await this.sectionRepository.findById(dto.toSectionId);
    if (!toSection) {
      throw new BadRequestException('Target section not found');
    }

    // 1. Capacity check
    const activeCount = await prisma.studentEnrollment.count({
      where: { sectionId: dto.toSectionId, status: 'ENROLLED' },
    });
    const classroom = await prisma.classroom.findUnique({
      where: { id: toSection.classroomId },
    });
    const capacity = classroom?.capacity || 30;

    AcademicIntegrityPolicy.validateSectionCapacity(activeCount, capacity);

    const fromSectionId = enrollment.sectionId;
    enrollment.assignSection(dto.toSectionId);

    await this.enrollmentRepository.save(enrollment);

    // Publish event
    await DomainEventBus.getInstance().publish(new StudentTransferred(enrollment.studentId, fromSectionId, toSection.id));
  }
}
