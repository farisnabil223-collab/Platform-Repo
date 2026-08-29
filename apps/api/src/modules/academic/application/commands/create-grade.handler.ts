import { ConflictException, Injectable } from '@nestjs/common';
import { GradeRepository } from '@eduverse/database';
import { Grade, GradeLevel, generateUuidV7, GradeCreatedEvent, DomainEventBus } from '@eduverse/kernel';
import { CreateGradeDto } from '../../dto/grade.dto';

@Injectable()
export class CreateGradeHandler {
  constructor(private readonly gradeRepository: GradeRepository) {}

  async execute(dto: CreateGradeDto): Promise<Grade> {
    const existing = await this.gradeRepository.findByLevel(dto.level);
    if (existing) {
      throw new ConflictException('Grade level already exists');
    }

    const grade = new Grade(generateUuidV7(), {
      level: new GradeLevel(dto.level),
      name: dto.name,
      description: dto.description,
    });

    await this.gradeRepository.save(grade);

    // Dispatch event
    await DomainEventBus.getInstance().publish(new GradeCreatedEvent(grade.id, grade.level.value));

    return grade;
  }
}
