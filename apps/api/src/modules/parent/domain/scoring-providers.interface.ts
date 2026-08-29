export interface IRiskScoringProvider {
  calculateRisk(studentId: string): Promise<{ level: string; score: number }>;
}
export const IRiskScoringProvider = Symbol('IRiskScoringProvider');

export interface ISuccessScoringProvider {
  calculateSuccessScore(studentId: string): Promise<number>;
}
export const ISuccessScoringProvider = Symbol('ISuccessScoringProvider');

export interface IRecommendationProvider {
  getRecommendations(studentId: string): Promise<any[]>;
}
export const IRecommendationProvider = Symbol('IRecommendationProvider');
