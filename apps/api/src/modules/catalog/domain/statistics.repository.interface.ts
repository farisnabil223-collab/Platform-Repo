export interface IStatisticsRepository {
  getCoursesCount(): Promise<number>;
  getTeachersCount(): Promise<number>;
  getStudentsCount(): Promise<number>;
  getReviewsCount(): Promise<number>;
}
export const IStatisticsRepository = Symbol('IStatisticsRepository');
