import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class JobSchedulerService {
  async queueJob(queue: string, name: string, payload: any, priority = 0) {
    return prisma.backgroundJob.create({
      data: {
        id: generateUuidV7(),
        queue,
        name,
        payload: payload || {},
        priority,
        status: 'PENDING',
        attempts: 0,
        maxAttempts: 3,
        scheduledAt: new Date(),
      },
    });
  }

  async retryJob(jobId: string) {
    const job = await prisma.backgroundJob.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Job not found');

    return prisma.backgroundJob.update({
      where: { id: jobId },
      data: {
        status: 'PENDING',
        attempts: { increment: 1 },
      },
    });
  }
}
