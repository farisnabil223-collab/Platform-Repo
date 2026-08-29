import { Injectable, ConflictException } from '@nestjs/common';
import { CourseRepository } from '@eduverse/database';
import { Course, CourseCode, CourseSlug, generateUuidV7 } from '@eduverse/kernel';
import { CreateCourseDto } from '../../dto/course.dto';

@Injectable()
export class CreateCourseHandler {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(dto: CreateCourseDto): Promise<Course> {
    const existingCode = await this.courseRepository.findByCode(dto.code);
    if (existingCode) {
      throw new ConflictException('Course code already exists');
    }

    const existingSlug = await this.courseRepository.findBySlug(dto.slug);
    if (existingSlug) {
      throw new ConflictException('Course slug already exists');
    }

    const course = new Course(generateUuidV7(), {
      code: new CourseCode(dto.code),
      slug: new CourseSlug(dto.slug),
      title: dto.title,
      description: dto.description,
      status: 'DRAFT',
      teacherId: dto.teacherId,
      version: 1,
    });

    await this.courseRepository.save(course);
    return course;
  }
}
