import { Injectable, ForbiddenException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class ParentService {
  async linkStudent(parentId: string, studentId: string, relationshipType: string) {
    return prisma.parentStudent.create({
      data: {
        id: generateUuidV7(),
        parentId,
        studentId,
        relationshipType,
        canViewGrades: true,
        canViewAttendance: true,
        canViewFinancials: true,
        canScheduleMeetings: true,
        canReceiveNotifications: true,
      },
    });
  }

  async verifyAccess(parentId: string, studentId: string, aspect: 'grades' | 'attendance' | 'financials') {
    const link = await prisma.parentStudent.findFirst({
      where: { parentId, studentId },
    });

    if (!link) {
      throw new ForbiddenException('Parent is not associated with this student.');
    }

    if (aspect === 'grades' && !link.canViewGrades) throw new ForbiddenException('Grades view restricted by custody rules.');
    if (aspect === 'attendance' && !link.canViewAttendance) throw new ForbiddenException('Attendance view restricted by custody rules.');
    if (aspect === 'financials' && !link.canViewFinancials) throw new ForbiddenException('Financials view restricted by custody rules.');

    // Log parent action
    await prisma.parentActivity.create({
      data: {
        id: generateUuidV7(),
        parentId,
        action: `VIEWED_${aspect.toUpperCase()}`,
      },
    });

    return true;
  }
}
