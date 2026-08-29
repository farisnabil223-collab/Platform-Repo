import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class PresenceService {
  async updateUserPresence(userId: string, status: 'ONLINE' | 'OFFLINE' | 'AWAY') {
    return prisma.userPresence.upsert({
      where: { userId },
      update: { status, lastSeen: new Date() },
      create: {
        id: generateUuidV7(),
        userId,
        status,
        lastSeen: new Date(),
      },
    });
  }

  async trackConnection(userId: string, socketId: string) {
    return prisma.activeConnection.upsert({
      where: { socketId },
      update: { userId },
      create: {
        id: generateUuidV7(),
        userId,
        socketId,
      },
    });
  }

  async removeConnection(socketId: string) {
    return prisma.activeConnection.deleteMany({
      where: { socketId },
    });
  }
}
