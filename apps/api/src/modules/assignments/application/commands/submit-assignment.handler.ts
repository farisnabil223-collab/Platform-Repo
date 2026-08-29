import { Injectable, BadRequestException } from '@nestjs/common';
import { AssignmentRepository, prisma } from '@eduverse/database';
import { AssignmentSubmittedEvent, DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { SubmitAssignmentDto } from '../../dto/assignment.dto';

@Injectable()
export class SubmitAssignmentHandler {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async execute(assignmentId: string, dto: SubmitAssignmentDto) {
    const assignment = await this.assignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw new BadRequestException('Assignment not found');
    }

    const previousAttempts = await prisma.assignmentSubmission.count({
      where: { assignmentId, studentId: dto.studentId },
    });

    if (previousAttempts >= assignment.maxAttempts) {
      throw new BadRequestException('Maximum submission attempt limit reached');
    }

    const submissionId = generateUuidV7();
    const attemptNumber = previousAttempts + 1;

    const submission = await prisma.assignmentSubmission.create({
      data: {
        id: submissionId,
        assignmentId,
        studentId: dto.studentId,
        attachments: dto.attachments,
        attemptNumber,
        status: 'SUBMITTED',
      },
    });

    // Publish event
    await DomainEventBus.getInstance().publish(
      new AssignmentSubmittedEvent(submissionId, dto.studentId, assignmentId)
    );

    return submission;
  }
}
