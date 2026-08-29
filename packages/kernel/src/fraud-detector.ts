export interface FraudAssessmentResult {
  isSuspicious: boolean;
  riskScore: number; // 0 to 100
  reason?: string;
}

export class FraudDetectorService {
  assess(context: { amount: number; countryCode: string; deviceIp: string; recentAttemptsCount: number }): FraudAssessmentResult {
    let riskScore = 0;

    // 1. High Velocity Check
    if (context.recentAttemptsCount > 5) {
      riskScore += 40;
    }

    // 2. High amount check
    if (context.amount > 5000) {
      riskScore += 30;
    }

    // 3. Simple Geo IP check simulation
    if (context.countryCode === 'UNKNOWN' || context.deviceIp.startsWith('10.')) {
      riskScore += 20;
    }

    return {
      isSuspicious: riskScore >= 50,
      riskScore,
      reason: riskScore >= 50 ? 'Suspicious activity detected: High risk score calculated' : undefined,
    };
  }
}
