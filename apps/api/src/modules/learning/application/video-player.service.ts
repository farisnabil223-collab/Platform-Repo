import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class VideoPlayerService {
  async trackSession(
    userId: string,
    lessonId: string,
    data: {
      playbackSpeed: number;
      currentTime: number;
      duration: number;
      device?: string;
      browser?: string;
      operatingSystem?: string;
      networkType?: string;
      pausedTime?: number;
      bufferTime?: number;
    }
  ) {
    const sessionId = generateUuidV7();
    await prisma.playerSession.create({
      data: {
        id: sessionId,
        userId,
        lessonId,
        pausedTime: data.pausedTime || 0,
        bufferTime: data.bufferTime || 0,
        networkType: data.networkType || 'WIFI',
        device: data.device || 'DESKTOP',
        operatingSystem: data.operatingSystem || 'LINUX',
        browser: data.browser || 'CHROME',
      },
    });

    return { sessionId };
  }
}
