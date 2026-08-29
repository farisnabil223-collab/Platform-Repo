import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class LiveSessionService {
  async startSession(courseId: string, provider: string, meetingId: string) {
    return prisma.liveSession.create({
      data: {
        id: generateUuidV7(),
        courseId,
        provider,
        meetingId,
        status: 'RUNNING',
      },
    });
  }

  async endSession(sessionId: string) {
    return prisma.liveSession.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });
  }

  async addRecording(sessionId: string, url: string, duration: number) {
    return prisma.liveRecording.create({
      data: {
        id: generateUuidV7(),
        liveSessionId: sessionId,
        recordingUrl: url,
        duration,
      },
    });
  }
}
