import { Injectable, ForbiddenException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class EditingLockService {
  async acquireLock(resourceId: string, userId: string, ttlSeconds = 300) {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const existingLock = await prisma.editingLock.findUnique({
      where: { resourceId },
    });

    if (existingLock) {
      if (existingLock.expiresAt.getTime() > Date.now()) {
        if (existingLock.userId !== userId) {
          throw new ForbiddenException('Resource is currently locked by another instructor.');
        }
        // Renew lock
        return prisma.editingLock.update({
          where: { resourceId },
          data: { expiresAt },
        });
      }
      // Expired lock, delete it
      await prisma.editingLock.delete({
        where: { resourceId },
      });
    }

    return prisma.editingLock.create({
      data: {
        id: generateUuidV7(),
        resourceId,
        userId,
        expiresAt,
      },
    });
  }

  async verifyLock(resourceId: string, userId: string): Promise<boolean> {
    const lock = await prisma.editingLock.findUnique({
      where: { resourceId },
    });

    if (!lock) return true;
    if (lock.expiresAt.getTime() <= Date.now()) return true; // Lock expired

    if (lock.userId !== userId) {
      throw new ForbiddenException('Access Denied: Resource is locked by another editor.');
    }

    return true;
  }

  async releaseLock(resourceId: string, userId: string) {
    const lock = await prisma.editingLock.findUnique({
      where: { resourceId },
    });

    if (lock && lock.userId === userId) {
      await prisma.editingLock.delete({
        where: { resourceId },
      });
    }
  }
}
