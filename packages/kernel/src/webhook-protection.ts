import * as crypto from 'crypto';

export class WebhookProtection {
  generateSignature(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expected = this.generateSignature(payload, secret);
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  }

  isTimestampValid(timestampHeader: string, windowMs = 300000): boolean {
    const timestamp = parseInt(timestampHeader, 10);
    if (isNaN(timestamp)) return false;
    const diff = Math.abs(Date.now() - timestamp);
    return diff <= windowMs; // Valid within a 5-minute replay protection window
  }
}
