import { Injectable, BadRequestException } from '@nestjs/common';
import { CourseRepository } from '@eduverse/database';
import { CourseArchivedEvent, DomainEventBus } from '@eduverse/kernel';
import { WorkflowEngine } from '@eduverse/workflow';

@Injectable()
export class ArchiveCourseHandler {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(courseId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    WorkflowEngine.validateCourseTransition(course.status, 'ARCHIVED');

    course.transitionTo('ARCHIVED');
    await this.courseRepository.save(course);

    // Publish event
    await DomainEventBus.getInstance().publish(new CourseArchivedEvent(course.id));
  }
}
