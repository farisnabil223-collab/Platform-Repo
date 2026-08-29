import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { SectionRepository, GradeRepository, ClassroomRepository } from '@eduverse/database';
import { Section, generateUuidV7 } from '@eduverse/kernel';
import { CreateSectionDto } from '../../dto/section.dto';

@Injectable()
export class CreateSectionHandler {
  constructor(
    private readonly sectionRepository: SectionRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly classroomRepository: ClassroomRepository
  ) {}

  async execute(dto: CreateSectionDto): Promise<Section> {
    const grade = await this.gradeRepository.findById(dto.gradeId);
    if (!grade) {
      throw new BadRequestException('Associated Grade not found');
    }

    const classroom = await this.classroomRepository.findById(dto.classroomId);
    if (!classroom) {
      throw new BadRequestException('Associated Classroom not found');
    }

    const existing = await this.sectionRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException('Section code already exists');
    }

    const section = new Section(generateUuidV7(), {
      name: dto.name,
      code: dto.code,
      gradeId: dto.gradeId,
      classroomId: dto.classroomId,
    });

    await this.sectionRepository.save(section);

    return section;
  }
}
