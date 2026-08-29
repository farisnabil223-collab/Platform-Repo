import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class IntegrityService {
  async logIncident(attemptId: string, type: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', metadata: any) {
    return prisma.integrityIncident.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        incidentType: type,
        severity,
        metadata: metadata || {},
      },
    });
  }

  async calculateRisk(attemptId: string) {
    const incidents = await prisma.integrityIncident.findMany({
      where: { attemptId },
    });

    let score = 0.0;
    for (const incident of incidents) {
      if (incident.severity === 'CRITICAL') score += 50;
      else if (incident.severity === 'HIGH') score += 25;
      else if (incident.severity === 'MEDIUM') score += 10;
      else score += 2;
    }

    const finalScore = Math.min(score, 100);
    const recommendation = finalScore > 50 ? 'DISQUALIFY' : finalScore > 20 ? 'REVIEW' : 'PASS';

    return prisma.integrityRisk.create({
      data: {
        id: generateUuidV7(),
        attemptId,
        score: finalScore,
        recommendation,
      },
    });
  }
}
