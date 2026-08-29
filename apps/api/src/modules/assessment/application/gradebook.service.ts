import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class GradebookService {
  async adjustGrade(gradeEntryId: string, adjustedScore: number, adjustedBy: string, reason: string) {
    const entry = await prisma.gradeEntry.findUniqueOrThrow({
      where: { id: gradeEntryId },
    });

    const oldScore = entry.score;

    // 1. Update Grade Entry
    const updatedEntry = await prisma.gradeEntry.update({
      where: { id: gradeEntryId },
      data: {
        score: adjustedScore,
        updatedAt: new Date(),
      },
    });

    // 2. Add Adjustment
    await prisma.gradeAdjustment.create({
      data: {
        id: generateUuidV7(),
        gradeEntryId,
        adjustedScore,
        adjustedBy,
        reason,
      },
    });

    // 3. Add History log
    await prisma.gradeHistory.create({
      data: {
        id: generateUuidV7(),
        gradeEntryId,
        oldScore,
        newScore: adjustedScore,
        changedBy: adjustedBy,
      },
    });

    return updatedEntry;
  }

  async getAppeals(userId: string) {
    return prisma.gradeAppeal.findMany({
      where: { student: { userId } },
    });
  }

  async createAppeal(userId: string, resultId: string, reason: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    return prisma.gradeAppeal.create({
      data: {
        id: generateUuidV7(),
        resultId,
        studentId: student.id,
        reason,
        status: 'SUBMITTED',
      },
    });
  }
}
