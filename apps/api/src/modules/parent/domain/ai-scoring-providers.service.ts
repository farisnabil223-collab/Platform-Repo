import { Injectable, Inject } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { IRiskScoringProvider, ISuccessScoringProvider, IRecommendationProvider } from './scoring-providers.interface';
import { IAIProvider } from '../../ai/domain/ai-providers.interface';

@Injectable()
export class AiScoringProvidersService implements IRiskScoringProvider, ISuccessScoringProvider, IRecommendationProvider {
  constructor(
    @Inject(IAIProvider) private readonly aiProvider: IAIProvider
  ) {}

  async calculateRisk(studentId: string): Promise<{ level: string; score: number }> {
    const summary = await prisma.attendanceSummary.findFirst({
      where: { studentId },
    });

    const successProfile = await prisma.studentSuccessProfile.findFirst({
      where: { studentId },
    });

    const prompt = `Calculate student risk. Attendance Total Days: ${summary?.totalDays || 0}, Absent Days: ${summary?.absentDays || 0}. Success profile score: ${successProfile?.successScore || 100}. Provide answer in JSON format with fields "level" (LOW, MEDIUM, HIGH, CRITICAL) and "score" (number 0-100).`;
    const response = await this.aiProvider.generateText(prompt);

    // Default fallback to rule-based if parsing fails
    let level = 'LOW';
    let score = 10;
    try {
      const parsed = JSON.parse(response.text.replace(/```json|```/g, '').trim());
      if (parsed.level) level = parsed.level;
      if (parsed.score !== undefined) score = parsed.score;
    } catch {
      // Rule-based fallback
      const absenceRate = (summary?.totalDays || 0) > 0 ? (summary?.absentDays || 0) / (summary?.totalDays || 1) : 0;
      if (absenceRate > 0.2) score += 40;
      if (successProfile && successProfile.successScore < 50) score += 40;
      if (score >= 70) level = 'CRITICAL';
      else if (score >= 50) level = 'HIGH';
      else if (score >= 30) level = 'MEDIUM';
    }

    return { level, score };
  }

  async calculateSuccessScore(studentId: string): Promise<number> {
    const risk = await this.calculateRisk(studentId);
    return Math.max(100 - risk.score, 0);
  }

  async getRecommendations(studentId: string): Promise<any[]> {
    const risk = await this.calculateRisk(studentId);
    const prompt = `Recommend academic interventions for student with risk level: ${risk.level} (Score: ${risk.score}). Return recommendations in JSON format as an array of objects with fields "recommendationType" and "description".`;
    const response = await this.aiProvider.generateText(prompt);

    try {
      const parsed = JSON.parse(response.text.replace(/```json|```/g, '').trim());
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    return [
      {
        recommendationType: 'AI_REVIEW_LESSON',
        description: 'Spend 30 minutes practicing algebra review questions.',
        confidenceScore: 0.9,
      },
    ];
  }
}
