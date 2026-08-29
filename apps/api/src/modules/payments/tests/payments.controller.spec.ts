import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../presentation/payments.controller';
import { PaymentsService } from '../application/payments.service';

describe('PaymentsController (Sprint 14 Payment Integration)', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /payments/webhooks/stripe — processes valid Stripe webhook event', async () => {
    const response = await controller.handleStripeWebhook('t=123,v1=abc', {
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test_123' } },
    });
    expect(response).toEqual({ received: true });
  });

  it('POST /payments/webhooks/paypal — processes valid PayPal webhook event', async () => {
    const response = await controller.handlePayPalWebhook({
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource: { id: 'PAYPAL_ORDER_123' },
    });
    expect(response).toEqual({ received: true });
  });

  it('GET /payments/reports/dashboard — returns financial metrics', async () => {
    const metrics = await controller.getFinancialReports();
    expect(metrics.monthlyRecurringRevenue).toBeGreaterThan(0);
    expect(metrics.annualRecurringRevenue).toBeGreaterThan(0);
  });
});
