import { Injectable } from '@nestjs/common';
import { AssignmentRepository } from '@eduverse/database';
import { Assignment, generateUuidV7 } from '@eduverse/kernel';
import { CreateAssignmentDto } from '../../dto/assignment.dto';

@Injectable()
export class CreateAssignmentHandler {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async execute(dto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = new Assignment(generateUuidV7(), {
      title: dto.title,
      instructions: dto.instructions,
      maxScore: dto.maxScore,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      rubric: dto.rubric ? JSON.parse(dto.rubric) : undefined,
      gradingCriteria: dto.gradingCriteria ? JSON.parse(dto.gradingCriteria) : undefined,
      maxAttempts: dto.maxAttempts,
      lateSubmissionPolicy: dto.lateSubmissionPolicy ? JSON.parse(dto.lateSubmissionPolicy) : undefined,
    });

    await this.assignmentRepository.save(assignment);
    return assignment;
  }
}
