import { Injectable } from '@nestjs/common';

export interface ISecretProvider {
  getSecret(key: string): Promise<string>;
}

export const ISecretProvider = Symbol('ISecretProvider');

@Injectable()
export class EnvSecretProvider implements ISecretProvider {
  async getSecret(key: string): Promise<string> {
    // Falls back to Env variables. Highly extensible for Vault/AWS Secrets Manager in future.
    return process.env[key] || '';
  }
}
