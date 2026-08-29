import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { SubjectRepository, GradeRepository } from '@eduverse/database';
import { Subject, SubjectCode, generateUuidV7, SubjectCreatedEvent, DomainEventBus } from '@eduverse/kernel';
import { CreateSubjectDto } from '../../dto/subject.dto';

@Injectable()
export class CreateSubjectHandler {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly gradeRepository: GradeRepository
  ) {}

  async execute(dto: CreateSubjectDto): Promise<Subject> {
    const grade = await this.gradeRepository.findById(dto.gradeId);
    if (!grade) {
      throw new BadRequestException('Associated Grade not found');
    }

    const existing = await this.subjectRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException('Subject code already exists');
    }

    const subject = new Subject(generateUuidV7(), {
      code: new SubjectCode(dto.code),
      name: dto.name,
      description: dto.description,
      creditHours: dto.creditHours,
      weeklyHours: dto.weeklyHours,
      isElective: dto.isElective,
      isActive: true,
      gradeId: dto.gradeId,
    });

    await this.subjectRepository.save(subject);

    // Dispatch event
    await DomainEventBus.getInstance().publish(new SubjectCreatedEvent(subject.id, subject.code.value));

    return subject;
  }
}
