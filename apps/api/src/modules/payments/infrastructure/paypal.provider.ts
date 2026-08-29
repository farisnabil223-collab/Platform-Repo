import { IPaymentGateway, GatewayChargeRequest, GatewayChargeResponse } from '@eduverse/kernel';
import * as https from 'https';

export class PayPalGateway implements IPaymentGateway {
  public readonly name = 'FallbackPayPal';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly isLive: boolean;

  constructor(clientId?: string, clientSecret?: string, environment?: string) {
    this.clientId = clientId || process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.PAYPAL_CLIENT_SECRET || '';
    this.isLive = (environment || process.env.PAYPAL_ENVIRONMENT) === 'live';
  }

  private get hostname(): string {
    return this.isLive ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com';
  }

  /**
   * Obtain PayPal OAuth2 Access Token
   */
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await this.httpRequest('/v1/oauth2/token', 'POST', 'grant_type=client_credentials', {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    if (!response.access_token) {
      throw new Error('Failed to obtain PayPal OAuth access token.');
    }
    return response.access_token;
  }

  /**
   * Execute PayPal Order Creation & Capture
   */
  async charge(req: GatewayChargeRequest): Promise<GatewayChargeResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal Client Credentials (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET) are missing.');
    }

    try {
      const accessToken = await this.getAccessToken();
      const payload = JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: req.paymentId,
            amount: {
              currency_code: req.currency.toUpperCase(),
              value: req.amount.toFixed(2),
            },
          },
        ],
      });

      const response = await this.httpRequest('/v2/checkout/orders', 'POST', payload, {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });

      if (response.status === 'CREATED' || response.status === 'APPROVED' || response.status === 'COMPLETED') {
        return {
          success: true,
          transactionReference: response.id,
          status: response.status === 'COMPLETED' ? 'CAPTURED' : 'PENDING',
        };
      }

      return {
        success: false,
        status: 'FAILED',
        errorMessage: response.message || 'PayPal order creation failed',
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'FAILED',
        errorMessage: err.message || 'PayPal transaction failed',
      };
    }
  }

  /**
   * Refund a captured PayPal payment
   */
  async refund(transactionRef: string, amount: number): Promise<boolean> {
    if (!this.clientId || !this.clientSecret) return false;

    try {
      const accessToken = await this.getAccessToken();
      const payload = JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency_code: 'USD',
        },
      });

      const response = await this.httpRequest(`/v2/payments/captures/${transactionRef}/refund`, 'POST', payload, {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });

      return response.status === 'COMPLETED';
    } catch {
      return false;
    }
  }

  /**
   * Native HTTPS Request helper for PayPal REST v2 API
   */
  private httpRequest(path: string, method: string, postData?: string, customHeaders?: Record<string, string>): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = {
        ...(customHeaders || {}),
        'Content-Length': postData ? Buffer.byteLength(postData) : 0,
      };

      const req = https.request(
        {
          hostname: this.hostname,
          port: 443,
          path,
          method,
          headers,
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
