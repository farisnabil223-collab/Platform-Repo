import { ConflictException, Injectable } from '@nestjs/common';
import { ClassroomRepository } from '@eduverse/database';
import { Classroom, generateUuidV7 } from '@eduverse/kernel';
import { CreateClassroomDto } from '../../dto/classroom.dto';

@Injectable()
export class CreateClassroomHandler {
  constructor(private readonly classroomRepository: ClassroomRepository) {}

  async execute(dto: CreateClassroomDto): Promise<Classroom> {
    const existing = await this.classroomRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException('Classroom code already exists');
    }

    const classroom = new Classroom(generateUuidV7(), {
      name: dto.name,
      code: dto.code,
      capacity: dto.capacity,
    });

    await this.classroomRepository.save(classroom);

    return classroom;
  }
}
