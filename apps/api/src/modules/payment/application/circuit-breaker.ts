import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PaymentProvider } from '@eduverse/payment-core';

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

@Injectable()
export class CircuitBreaker {
  private state = CircuitBreakerState.CLOSED;
  private failures = 0;
  private lastStateChange = Date.now();
  private readonly failureThreshold = 5;
  private readonly timeoutMs = 30000; // 30 seconds

  async execute<T>(providerName: PaymentProvider, operation: () => Promise<T>): Promise<T> {
    this.checkState();

    if (this.state === CircuitBreakerState.OPEN) {
      throw new ServiceUnavailableException(`Circuit breaker is OPEN for ${providerName}. Operation rejected.`);
    }

    const startTime = Date.now();
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private checkState() {
    if (this.state === CircuitBreakerState.OPEN && Date.now() - this.lastStateChange > this.timeoutMs) {
      this.setState(CircuitBreakerState.HALF_OPEN);
    }
  }

  private onSuccess() {
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.setState(CircuitBreakerState.CLOSED);
      this.failures = 0;
    }
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.setState(CircuitBreakerState.OPEN);
    }
  }

  private setState(state: CircuitBreakerState) {
    this.state = state;
    this.lastStateChange = Date.now();
  }

  getState(): CircuitBreakerState {
    return this.state;
  }
}
