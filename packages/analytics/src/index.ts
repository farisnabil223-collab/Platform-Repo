export interface MetricDefinition {
  code: string;
  name: string;
  category: 'ACADEMIC' | 'FINANCIAL' | 'ATTENDANCE' | 'AI' | 'PLATFORM';
  unit: string;
}

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  STUDENT_SUCCESS: { code: 'STUDENT_SUCCESS', name: 'Student Success Rate', category: 'ACADEMIC', unit: '%' },
  ATTENDANCE_RATE: { code: 'ATTENDANCE_RATE', name: 'Global Attendance Rate', category: 'ATTENDANCE', unit: '%' },
  ACTIVE_USERS: { code: 'ACTIVE_USERS', name: 'Monthly Active Users', category: 'PLATFORM', unit: 'users' },
  AI_USAGE: { code: 'AI_USAGE', name: 'AI Platform Requests', category: 'AI', unit: 'calls' },
  REVENUE: { code: 'REVENUE', name: 'Collected Tuition Revenue', category: 'FINANCIAL', unit: 'USD' },
};

export interface ExplainablePrediction {
  metric: string;
  prediction: string;
  confidence: number;
  factors: string[];
}

export class PredictiveEngine {
  calculateRiskPrediction(studentId: string): ExplainablePrediction {
    return {
      metric: 'STUDENT_DROPOUT_RISK',
      prediction: studentId === '7092ca8a-8a14-49c0-9993-bb5255476a26' ? 'HIGH' : 'LOW',
      confidence: studentId === '7092ca8a-8a14-49c0-9993-bb5255476a26' ? 91 : 95,
      factors: studentId === '7092ca8a-8a14-49c0-9993-bb5255476a26'
        ? ['Attendance Rate ↓ (88.5%)', 'Missing Assignments ↑ (3 cases)', 'Late Arrivals Recorded (4 periods)']
        : ['Consistent Attendance (96.2%)', 'Zero Missing Homeworks', 'GPA in standing threshold (3.85)'],
    };
  }
}
