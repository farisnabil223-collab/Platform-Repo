import { Injectable, BadRequestException } from '@nestjs/common';
import { IPaymentProvider, PaymentProvider } from '@eduverse/payment-core';

@Injectable()
export class PaymentProviderRegistry {
  private readonly providers = new Map<PaymentProvider, IPaymentProvider>();

  register(name: PaymentProvider, provider: IPaymentProvider) {
    this.providers.set(name, provider);
  }

  resolve(name: PaymentProvider): IPaymentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new BadRequestException(`Payment provider not found or not configured: ${name}`);
    }
    return provider;
  }

  has(name: PaymentProvider): boolean {
    return this.providers.has(name);
  }
}
