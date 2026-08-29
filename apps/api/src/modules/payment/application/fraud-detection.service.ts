import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FraudDetectionService {
  private readonly recentRequests = new Map<string, number>();

  validateRequest(userId: string, key: string, amount: number, currency: string) {
    // 1. Replay prevention and rapid rate attempt checking
    const now = Date.now();
    const rateKey = `${userId}:${key}`;
    const lastRequestTime = this.recentRequests.get(rateKey);
    if (lastRequestTime && now - lastRequestTime < 2000) {
      throw new BadRequestException('Multiple rapid payment requests detected. Please try again in a few seconds.');
    }
    this.recentRequests.set(rateKey, now);

    // Evict old request keys to manage memory
    if (this.recentRequests.size > 1000) {
      for (const [k, time] of this.recentRequests.entries()) {
        if (now - time > 10000) {
          this.recentRequests.delete(k);
        }
      }
    }
  }

  verifyAmountAndCurrency(expectedAmount: number, actualAmount: number, expectedCur: string, actualCur: string) {
    if (Math.abs(expectedAmount - actualAmount) > 0.01) {
      throw new BadRequestException('Security Alert: Payment amount mismatch detected!');
    }
    if (expectedCur.toUpperCase() !== actualCur.toUpperCase()) {
      throw new BadRequestException('Security Alert: Payment currency mismatch detected!');
    }
  }
}
