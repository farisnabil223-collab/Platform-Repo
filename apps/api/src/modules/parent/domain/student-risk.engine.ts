import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { IRiskScoringProvider, ISuccessScoringProvider } from './scoring-providers.interface';

@Injectable()
export class StudentRiskEngine implements IRiskScoringProvider, ISuccessScoringProvider {
  async calculateRisk(studentId: string): Promise<{ level: string; score: number }> {
    const summary = await prisma.attendanceSummary.findFirst({
      where: { studentId },
    });

    let score = 0;
    if (summary) {
      const absenceRate = summary.totalDays > 0 ? summary.absentDays / summary.totalDays : 0;
      if (absenceRate > 0.2) score += 40;
      else if (absenceRate > 0.1) score += 20;
    }

    const successProfile = await prisma.studentSuccessProfile.findFirst({
      where: { studentId },
    });

    if (successProfile && successProfile.successScore < 50) {
      score += 40;
    }

    let level = 'LOW';
    if (score >= 70) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 30) level = 'MEDIUM';

    return { level, score };
  }

  async calculateSuccessScore(studentId: string): Promise<number> {
    const risk = await this.calculateRisk(studentId);
    return Math.max(100 - risk.score, 0);
  }
}
