import { Injectable } from '@nestjs/common';

@Injectable()
export class FeatureFlagService {
  private flags = new Map<string, boolean>([
    ['payment-stripe-enabled', true],
    ['payment-paymob-enabled', true],
    ['assessment-proctoring-enabled', false],
    ['ai-recommendations-enabled', true],
  ]);

  isEnabled(flag: string): boolean {
    return this.flags.get(flag) ?? false;
  }

  setFlag(flag: string, value: boolean) {
    this.flags.set(flag, value);
  }
}
