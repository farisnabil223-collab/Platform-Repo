import { Injectable } from '@nestjs/common';
import { PaymentProvider, ProviderHealthStatus } from '@eduverse/payment-core';

@Injectable()
export class ProviderHealthMonitor {
  private readonly latencies = new Map<PaymentProvider, number[]>();
  private readonly successRates = new Map<PaymentProvider, { success: number; total: number }>();
  private readonly healthStatuses = new Map<PaymentProvider, ProviderHealthStatus>();

  recordMetrics(provider: PaymentProvider, durationMs: number, success: boolean) {
    // Latencies
    if (!this.latencies.has(provider)) {
      this.latencies.set(provider, []);
    }
    const list = this.latencies.get(provider)!;
    list.push(durationMs);
    if (list.length > 50) list.shift();

    // Success rates
    if (!this.successRates.has(provider)) {
      this.successRates.set(provider, { success: 0, total: 0 });
    }
    const rates = this.successRates.get(provider)!;
    rates.total++;
    if (success) rates.success++;

    // Calculate status dynamically based on last failures
    const recentSuccessRate = rates.success / rates.total;
    if (rates.total > 5 && recentSuccessRate < 0.5) {
      this.healthStatuses.set(provider, ProviderHealthStatus.DOWN);
    } else if (rates.total > 5 && recentSuccessRate < 0.8) {
      this.healthStatuses.set(provider, ProviderHealthStatus.DEGRADED);
    } else {
      this.healthStatuses.set(provider, ProviderHealthStatus.HEALTHY);
    }
  }

  getHealthStatus(provider: PaymentProvider): ProviderHealthStatus {
    return this.healthStatuses.get(provider) || ProviderHealthStatus.HEALTHY;
  }

  getAverageLatency(provider: PaymentProvider): number {
    const list = this.latencies.get(provider) || [];
    if (list.length === 0) return 0;
    return list.reduce((a, b) => a + b, 0) / list.length;
  }
}
