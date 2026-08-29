import { Injectable, Inject, Optional } from '@nestjs/common';
import { IExchangeRateProvider } from '../domain/exchange-rate.provider.interface';

@Injectable()
export class PaymentCurrencyEngine {
  private readonly rateCache = new Map<string, { rate: number; expiresAt: number }>();
  private readonly cacheDurationMs = 3600000; // 1 hour caching

  constructor(
    @Optional()
    @Inject(IExchangeRateProvider)
    private readonly rateProvider?: IExchangeRateProvider
  ) {}

  async convertAmount(amount: number, from: string, to: string): Promise<number> {
    if (from.toUpperCase() === to.toUpperCase()) return amount;
    
    const rate = await this.getExchangeRate(from, to);
    return amount * rate;
  }

  async getExchangeRate(from: string, to: string): Promise<number> {
    const key = `${from.toUpperCase()}:${to.toUpperCase()}`;
    const cached = this.rateCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.rate;
    }

    let rate = 1.0;
    if (this.rateProvider) {
      rate = await this.rateProvider.getRate(from, to);
    } else {
      // Mock defaults if provider not injected
      if (from.toUpperCase() === 'USD' && to.toUpperCase() === 'EGP') rate = 50.0;
      if (from.toUpperCase() === 'EGP' && to.toUpperCase() === 'USD') rate = 0.02;
    }

    this.rateCache.set(key, {
      rate,
      expiresAt: Date.now() + this.cacheDurationMs,
    });

    return rate;
  }
}
