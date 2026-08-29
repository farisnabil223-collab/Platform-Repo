import * as crypto from 'crypto';

export class SecretRotation {
  generateSecureKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  isRotationRequired(expiresAt: Date, leadDays = 7): boolean {
    const leadTimeMs = leadDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return expiresAt.getTime() - now <= leadTimeMs; // Requires rotation if within lead window
  }

  encryptValue(value: string, keyHex: string): string {
    const key = Buffer.from(keyHex, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }
}
