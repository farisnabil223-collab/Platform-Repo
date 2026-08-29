import { IPaymentGateway, PaymentOrchestrator, MockGateway } from '@eduverse/kernel';
import { StripeGateway } from './stripe.provider';
import { PayPalGateway } from './paypal.provider';

export function createPaymentOrchestrator(): PaymentOrchestrator {
  const gateways: IPaymentGateway[] = [];

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const paypalClientId = process.env.PAYPAL_CLIENT_ID;

  if (stripeKey && stripeKey.trim().length > 0) {
    gateways.push(new StripeGateway(stripeKey));
  }

  if (paypalClientId && paypalClientId.trim().length > 0) {
    gateways.push(new PayPalGateway(paypalClientId, process.env.PAYPAL_CLIENT_SECRET));
  }

  // Fallback to Mock Gateways if environment credentials are not present (Dev/Test mode)
  if (gateways.length === 0) {
    gateways.push(new MockGateway('PrimaryStripe'));
    gateways.push(new MockGateway('FallbackPayPal'));
  }

  return new PaymentOrchestrator(gateways);
}
