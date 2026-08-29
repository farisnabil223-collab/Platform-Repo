import { Injectable } from '@nestjs/common';

export interface StorageProvider {
  upload(key: string, data: Buffer): Promise<string>;
  getDownloadUrl(key: string): Promise<string>;
}

@Injectable()
export class StorageService {
  private providers = new Map<string, StorageProvider>();

  registerProvider(name: string, provider: StorageProvider) {
    this.providers.set(name, provider);
  }

  getProvider(name = 'local'): StorageProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      // Return a basic fallback local-simulate provider
      return {
        async upload(key: string, data: Buffer): Promise<string> {
          return `local://storage/${key}`;
        },
        async getDownloadUrl(key: string): Promise<string> {
          return `https://cdn.eduverse.com/storage/${key}`;
        },
      };
    }
    return provider;
  }
}
