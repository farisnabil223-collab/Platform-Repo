import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class HealthService {
  async saveSnapshot(cpu: number, memory: number, disk: number, latency: number) {
    return prisma.healthSnapshot.create({
      data: {
        id: generateUuidV7(),
        cpu,
        memory,
        disk,
        redis: 1.0,
        postgres: 1.0,
        queue: 0.0,
        api: 1.0,
        storage: 1.0,
        latency,
      },
    });
  }

  async getIncidents() {
    return prisma.serviceIncident.findMany({
      where: { status: 'ACTIVE' },
    });
  }
}
