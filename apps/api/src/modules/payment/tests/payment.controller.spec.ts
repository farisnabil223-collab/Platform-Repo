import { Test, TestingModule } from '@nestjs/testing';
import { StudentPaymentController } from '../presentation/student-payment.controller';
import { AdminPaymentController } from '../presentation/admin-payment.controller';
import { WebhookController } from '../presentation/webhook.controller';
import { PaymentOrchestrator } from '../application/payment.orchestrator';
import { IBillingRepository } from '../domain/billing.repository.interface';
import { IInvoiceStorageProvider } from '../domain/invoice-storage.provider.interface';

describe('PaymentControllers', () => {
  let studentController: StudentPaymentController;
  let adminController: AdminPaymentController;
  let webhookController: WebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentPaymentController, AdminPaymentController, WebhookController],
      providers: [
        {
          provide: PaymentOrchestrator,
          useValue: {
            createIntent: jest.fn().mockResolvedValue({}),
            handleWebhook: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: IBillingRepository,
          useValue: {
            findInvoiceById: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: IInvoiceStorageProvider,
          useValue: {
            downloadInvoice: jest.fn().mockResolvedValue(Buffer.from('')),
          },
        },
      ],
    }).compile();

    studentController = module.get<StudentPaymentController>(StudentPaymentController);
    adminController = module.get<AdminPaymentController>(AdminPaymentController);
    webhookController = module.get<WebhookController>(WebhookController);
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
    expect(adminController).toBeDefined();
    expect(webhookController).toBeDefined();
  });
});
