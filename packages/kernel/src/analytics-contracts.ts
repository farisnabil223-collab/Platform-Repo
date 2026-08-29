export interface CourseAnalyticsMetrics {
  courseId: string;
  viewsCount: number;
  enrollmentsCount: number;
  completionRate: number;
  averageWatchTimeSeconds: number;
  dropOffPoints: Record<string, number>; // Maps lessonId to dropoff count
}

export interface QuizAnalyticsMetrics {
  quizId: string;
  attemptsCount: number;
  averageScore: number;
  passRate: number;
}

export interface AssignmentAnalyticsMetrics {
  assignmentId: string;
  submissionsCount: number;
  averageGrade: number;
  onTimeSubmissionRate: number;
}

export interface IAnalyticsTracker {
  trackCourseView(courseId: string, studentId?: string): Promise<void>;
  trackLessonAccess(lessonId: string, studentId: string): Promise<void>;
  trackVideoHeartbeat(studentId: string, mediaAssetId: string, watchOffsetSeconds: number): Promise<void>;
  getCourseAnalytics(courseId: string): Promise<CourseAnalyticsMetrics>;
  getQuizAnalytics(quizId: string): Promise<QuizAnalyticsMetrics>;
  getAssignmentAnalytics(assignmentId: string): Promise<AssignmentAnalyticsMetrics>;
}
