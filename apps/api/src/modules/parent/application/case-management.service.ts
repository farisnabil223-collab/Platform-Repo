import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class CaseManagementService {
  async openCase(orgId: string, studentId: string, priority = 'MEDIUM') {
    return prisma.studentCase.create({
      data: {
        id: generateUuidV7(),
        organizationId: orgId,
        studentId,
        status: 'OPEN',
        priority,
      },
    });
  }

  async addTask(caseId: string, title: string, assigneeId: string) {
    return prisma.studentCaseTask.create({
      data: {
        id: generateUuidV7(),
        studentCaseId: caseId,
        title,
        assigneeId,
        status: 'TODO',
      },
    });
  }

  async transitionStatus(caseId: string, status: string) {
    return prisma.studentCase.update({
      where: { id: caseId },
      data: { status },
    });
  }
}
