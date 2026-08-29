import { IPaymentGateway, GatewayChargeRequest, GatewayChargeResponse } from '@eduverse/kernel';
import * as crypto from 'crypto';
import * as https from 'https';

export class StripeGateway implements IPaymentGateway {
  public readonly name = 'StripePrimary';
  private readonly apiKey: string;
  private readonly webhookSecret: string;

  constructor(apiKey?: string, webhookSecret?: string) {
    this.apiKey = apiKey || process.env.STRIPE_SECRET_KEY || '';
    this.webhookSecret = webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  /**
   * Execute Stripe Payment Intent Charge
   */
  async charge(req: GatewayChargeRequest): Promise<GatewayChargeResponse> {
    if (!this.apiKey) {
      throw new Error('Stripe API Key (STRIPE_SECRET_KEY) is missing in environment.');
    }

    try {
      const params = new URLSearchParams({
        amount: Math.round(req.amount * 100).toString(), // convert to cents
        currency: req.currency.toLowerCase(),
        'payment_method_types[]': 'card',
        'metadata[paymentId]': req.paymentId,
        confirm: 'true',
      });

      if (req.paymentMethodToken) {
        params.append('payment_method', req.paymentMethodToken);
      }

      const response = await this.httpRequest('/v1/payment_intents', 'POST', params.toString());

      if (response.error) {
        return {
          success: false,
          status: 'FAILED',
          errorMessage: response.error.message || 'Stripe processing error',
        };
      }

      return {
        success: response.status === 'succeeded' || response.status === 'requires_action',
        transactionReference: response.id,
        status: response.status === 'succeeded' ? 'CAPTURED' : 'PENDING',
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'FAILED',
        errorMessage: err.message || 'Stripe transaction failed',
      };
    }
  }

  /**
   * Refund a Stripe transaction
   */
  async refund(transactionRef: string, amount: number): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('Stripe API Key is missing.');
    }

    try {
      const params = new URLSearchParams({
        payment_intent: transactionRef,
        amount: Math.round(amount * 100).toString(),
      });

      const response = await this.httpRequest('/v1/refunds', 'POST', params.toString());
      return response.status === 'succeeded';
    } catch {
      return false;
    }
  }

  /**
   * Verify HMAC signature of incoming Stripe Webhook event
   */
  verifyWebhookSignature(payload: string | Buffer, signatureHeader: string): boolean {
    if (!this.webhookSecret || !signatureHeader) return false;

    const items = signatureHeader.split(',');
    let timestamp = '';
    let signature = '';

    for (const item of items) {
      const [key, val] = item.trim().split('=');
      if (key === 't') timestamp = val;
      if (key === 'v1') signature = val;
    }

    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${payload.toString()}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Native HTTPS Request helper for Stripe REST API
   */
  private httpRequest(path: string, method: string, postData?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.stripe.com',
          port: 443,
          path,
          method,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData ? Buffer.byteLength(postData) : 0,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }
}
