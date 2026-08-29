import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { LessonRepository, ModuleRepository } from '@eduverse/database';
import { Lesson, LessonCode, generateUuidV7 } from '@eduverse/kernel';
import { CreateLessonDto } from '../../dto/course.dto';

@Injectable()
export class CreateLessonHandler {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly moduleRepository: ModuleRepository
  ) {}

  async execute(moduleId: string, dto: CreateLessonDto): Promise<Lesson> {
    const parentModule = await this.moduleRepository.findById(moduleId);
    if (!parentModule) {
      throw new BadRequestException('Module not found');
    }

    const existingCode = await this.lessonRepository.findByCode(dto.code);
    if (existingCode) {
      throw new ConflictException('Lesson code already exists');
    }

    const lesson = new Lesson(generateUuidV7(), {
      moduleId,
      code: new LessonCode(dto.code),
      title: dto.title,
      sortOrder: dto.sortOrder,
      displayOrder: dto.displayOrder,
      estimatedDuration: dto.estimatedDuration,
      isLocked: dto.isLocked,
      unlockCondition: dto.unlockCondition ? JSON.parse(dto.unlockCondition) : undefined,
    });

    await this.lessonRepository.save(lesson);
    return lesson;
  }
}
