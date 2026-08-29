import { Injectable } from '@nestjs/common';
import { IContentDeliveryProvider } from '../domain/content-delivery.provider.interface';

@Injectable()
export class S3ContentDeliveryProvider implements IContentDeliveryProvider {
  async generateSignedDownloadUrl(resourceKey: string): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiration
    const signature = Buffer.from(resourceKey + expires).toString('base64').substring(0, 16);
    return `${resourceKey}?signature=${signature}&expires=${expires}`;
  }
}
