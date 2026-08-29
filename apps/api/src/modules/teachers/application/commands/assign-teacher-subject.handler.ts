import { BadRequestException, Injectable } from '@nestjs/common';
import { TeacherProfileRepository, SubjectRepository, prisma } from '@eduverse/database';
import { TeacherAssigned, DomainEventBus } from '@eduverse/kernel';
import { AssignSubjectDto } from '../../dto/assign-subject.dto';

@Injectable()
export class AssignTeacherSubjectHandler {
  constructor(
    private readonly teacherProfileRepository: TeacherProfileRepository,
    private readonly subjectRepository: SubjectRepository
  ) {}

  async execute(teacherId: string, dto: AssignSubjectDto): Promise<void> {
    const teacher = await this.teacherProfileRepository.findById(teacherId);
    if (!teacher) {
      throw new BadRequestException('Teacher profile not found');
    }

    const subject = await this.subjectRepository.findById(dto.subjectId);
    if (!subject) {
      throw new BadRequestException('Subject not found');
    }

    // Check if already mapped
    const existing = await prisma.teacherSubject.findUnique({
      where: {
        teacherId_subjectId: { teacherId, subjectId: dto.subjectId },
      },
    });

    if (existing) {
      return;
    }

    await prisma.teacherSubject.create({
      data: {
        teacherId,
        subjectId: dto.subjectId,
      },
    });

    // Publish event
    await DomainEventBus.getInstance().publish(new TeacherAssigned(teacherId, dto.subjectId));
  }
}
