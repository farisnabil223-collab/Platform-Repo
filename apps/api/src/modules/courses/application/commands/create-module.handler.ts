import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { ModuleRepository, CourseRepository } from '@eduverse/database';
import { Module, ModuleCode, generateUuidV7 } from '@eduverse/kernel';
import { CreateModuleDto } from '../../dto/course.dto';

@Injectable()
export class CreateModuleHandler {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly courseRepository: CourseRepository
  ) {}

  async execute(courseId: string, dto: CreateModuleDto): Promise<Module> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const existingCode = await this.moduleRepository.findByCode(dto.code);
    if (existingCode) {
      throw new ConflictException('Module code already exists');
    }

    const module = new Module(generateUuidV7(), {
      courseId,
      code: new ModuleCode(dto.code),
      title: dto.title,
      sortOrder: dto.sortOrder,
    });

    await this.moduleRepository.save(module);
    return module;
  }
}
