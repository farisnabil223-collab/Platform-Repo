import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { StudentPaymentController } from './presentation/student-payment.controller';
import { AdminPaymentController } from './presentation/admin-payment.controller';
import { WebhookController } from './presentation/webhook.controller';
import { PaymentOrchestrator } from './application/payment.orchestrator';
import { PaymentProviderRegistry } from './application/payment-provider.registry';
import { ProviderHealthMonitor } from './application/provider-health-monitor';
import { RetryEngine } from './application/retry-engine';
import { FraudDetectionService } from './application/fraud-detection.service';
import { TaxService } from './application/tax.service';
import { PaymentCurrencyEngine } from './application/payment-currency.engine';
import { EnvSecretProvider, ISecretProvider } from './application/secret-provider';
import { PaymentLifecycleService } from './domain/payment-lifecycle.service';
import { InvoiceGenerationService } from './domain/invoice-generation.service';
import { IPaymentRepository } from './domain/payment.repository.interface';
import { IBillingRepository } from './domain/billing.repository.interface';
import { IInvoiceStorageProvider } from './domain/invoice-storage.provider.interface';
import { PrismaPaymentRepository } from './infrastructure/prisma-payment.repository';
import { PrismaBillingRepository } from './infrastructure/prisma-billing.repository';
import { LocalInvoiceStorageProvider } from './infrastructure/local-invoice-storage.provider';
import { PDFGenerator } from './infrastructure/pdf-generator';
import { PaymobProvider } from './provider/paymob.provider';
import { PaymentProvider } from '@eduverse/payment-core';
import { PaymentsController } from '../payments/presentation/payments.controller';
import { PaymentsService } from '../payments/application/payments.service';

@Module({
  controllers: [StudentPaymentController, AdminPaymentController, WebhookController, PaymentsController],
  providers: [
    PaymentsService,
    PaymentOrchestrator,
    PaymentProviderRegistry,
    ProviderHealthMonitor,
    RetryEngine,
    FraudDetectionService,
    TaxService,
    PaymentCurrencyEngine,
    PaymentLifecycleService,
    InvoiceGenerationService,
    PDFGenerator,
    PaymobProvider,
    {
      provide: ISecretProvider,
      useClass: EnvSecretProvider,
    },
    {
      provide: IPaymentRepository,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: IBillingRepository,
      useClass: PrismaBillingRepository,
    },
    {
      provide: IInvoiceStorageProvider,
      useClass: LocalInvoiceStorageProvider,
    },
  ],
  exports: [
    PaymentsService,
    PaymentOrchestrator,
    PaymentProviderRegistry,
    IPaymentRepository,
    IBillingRepository,
    IInvoiceStorageProvider,
  ],
})
export class PaymentModule implements OnModuleInit {
  constructor(
    private readonly registry: PaymentProviderRegistry,
    private readonly paymobProvider: PaymobProvider
  ) {}

  onModuleInit() {
    // Register Paymob gateway provider at startup
    this.registry.register(PaymentProvider.PAYMOB, this.paymobProvider);
  }
}
