import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class ExamEngineService {
  async saveCheckpoint(attemptId: string, progress: number, answers: any) {
    return prisma.examCheckpoint.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        progress,
        answersJson: answers || {},
      },
    });
  }

  async getLatestCheckpoint(attemptId: string) {
    return prisma.examCheckpoint.findFirst({
      where: { attemptId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendHeartbeat(attemptId: string, deviceId: string) {
    return prisma.examHeartbeat.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        deviceId,
      },
    });
  }

  async acquireLock(assessmentId: string, studentId: string, durationSeconds = 300) {
    const activeLock = await prisma.examLock.findFirst({
      where: {
        assessmentId,
        studentId,
        lockedUntil: { gte: new Date() },
      },
    });
    if (activeLock) {
      throw new Error('Exam session is currently locked');
    }

    const lockedUntil = new Date(Date.now() + durationSeconds * 1000);
    return prisma.examLock.create({
      data: {
        id: generateUuidV7(),
        assessmentId,
        studentId,
        lockedUntil,
      },
    });
  }
}
