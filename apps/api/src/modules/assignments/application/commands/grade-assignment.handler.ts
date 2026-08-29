import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { AssignmentGradedEvent, DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { GradeSubmissionDto } from '../../dto/assignment.dto';

@Injectable()
export class GradeAssignmentHandler {
  async execute(submissionId: string, dto: GradeSubmissionDto) {
    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new BadRequestException('Submission not found');
    }

    await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: { status: 'GRADED' },
    });

    const grade = await prisma.assignmentGrade.upsert({
      where: { submissionId },
      update: {
        score: dto.score,
        gradedBy: dto.gradedBy,
        feedback: dto.feedback,
      },
      create: {
        id: generateUuidV7(),
        submissionId,
        score: dto.score,
        gradedBy: dto.gradedBy,
        feedback: dto.feedback,
      },
    });

    // Publish event
    await DomainEventBus.getInstance().publish(
      new AssignmentGradedEvent(submissionId, dto.score, dto.gradedBy)
    );

    return grade;
  }
}
