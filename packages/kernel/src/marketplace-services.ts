import * as crypto from 'crypto';
import { DomainRuleViolationException } from './domain-exceptions';

export class WebhookSigner {
  signPayload(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expected = this.signPayload(payload, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }
}

export class RateLimiterEvaluator {
  private readonly hits = new Map<string, { count: number; windowStart: number }>();

  checkLimit(keyHash: string, limit: number): void {
    const now = Date.now();
    const current = this.hits.get(keyHash);

    if (!current || now - current.windowStart > 60000) {
      this.hits.set(keyHash, { count: 1, windowStart: now });
      return;
    }

    if (current.count >= limit) {
      throw new DomainRuleViolationException('API Rate Limit Exceeded: Please slow down your requests');
    }

    current.count++;
  }
}

export interface ConflictRecord {
  id: string;
  updatedAt: Date;
  data: any;
}

export class SyncConflictResolver {
  resolve(local: ConflictRecord, remote: ConflictRecord): ConflictRecord {
    // Last-Write-Wins (LWW) conflict resolution policy rule
    if (remote.updatedAt > local.updatedAt) {
      return remote;
    }
    return local;
  }
}
