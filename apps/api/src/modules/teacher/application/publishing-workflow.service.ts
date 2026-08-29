import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class PublishingWorkflowService {
  async submitForReview(courseId: string) {
    // Basic publishing checklist checks
    const course = await prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } } },
    });

    if (course.modules.length === 0) {
      throw new BadRequestException('Publishing Checklist Failed: Course must contain at least one module.');
    }

    return prisma.publishingWorkflow.create({
      data: {
        id: generateUuidV7(),
        courseId,
        status: 'READY_FOR_REVIEW',
      },
    });
  }

  async assignReviewer(workflowId: string, reviewerId: string) {
    return prisma.publishingWorkflow.update({
      where: { id: workflowId },
      data: {
        reviewerId,
        status: 'REVIEWER_ASSIGNED',
      },
    });
  }

  async approveWorkflow(workflowId: string, notes: string) {
    const workflow = await prisma.publishingWorkflow.update({
      where: { id: workflowId },
      data: {
        status: 'APPROVED',
        approvalNotes: notes,
      },
    });

    // Update main course publish status
    await prisma.course.update({
      where: { id: workflow.courseId },
      data: { status: 'PUBLISHED' },
    });

    return workflow;
  }

  async schedulePublish(courseId: string, scheduledAt: Date) {
    return prisma.publishingSchedule.create({
      data: {
        id: generateUuidV7(),
        courseId,
        scheduledAt,
        status: 'PENDING',
      },
    });
  }
}
