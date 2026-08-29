import * as crypto from 'crypto';

export interface ChainLogItem {
  id: string;
  action: string;
  actorId: string;
  payload: any;
  hashChain: string;
}

export class AuditChainVerifier {
  calculateHash(item: ChainLogItem, previousHash: string): string {
    const content = `${item.id}-${item.action}-${item.actorId}-${JSON.stringify(item.payload)}-${previousHash}`;
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }

  verifyChain(items: ChainLogItem[]): boolean {
    let previousHash = '';
    for (const item of items) {
      const computedHash = this.calculateHash(item, previousHash);
      if (item.hashChain !== computedHash) {
        return false; // Chain tampering detected
      }
      previousHash = item.hashChain;
    }
    return true; // Chain integrity verified successfully
  }
}
