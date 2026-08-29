import { KPI } from './analytics-aggregates';

export class AnalyticsQueryEngine {
  calculateKPIValue(kpi: KPI, dataset: any[]): number {
    // Basic dynamic evaluation simulator
    if (kpi.formulaExpression.includes('SUM')) {
      return dataset.reduce((sum, item) => sum + (item.value || 0), 0);
    }
    if (kpi.formulaExpression.includes('AVG')) {
      if (dataset.length === 0) return 0;
      return dataset.reduce((sum, item) => sum + (item.value || 0), 0) / dataset.length;
    }
    return kpi.currentValue;
  }

  extractFeatureVector(studentId: string, activityFacts: any[], assessmentFacts: any[]): { studentId: string; features: number[] } {
    const studentActivities = activityFacts.filter(f => f.studentId === studentId);
    const studentAssessments = assessmentFacts.filter(f => f.studentId === studentId);

    const totalDuration = studentActivities.reduce((sum, f) => sum + f.duration, 0);
    const averageScore = studentAssessments.length > 0
      ? studentAssessments.reduce((sum, f) => sum + f.score, 0) / studentAssessments.length
      : 0;

    return {
      studentId,
      features: [totalDuration, averageScore, studentAssessments.length],
    };
  }
}
