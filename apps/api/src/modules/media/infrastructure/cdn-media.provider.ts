import { Injectable } from '@nestjs/common';
import { IMediaProvider } from '../domain/media-provider.interface';

@Injectable()
export class CdnMediaProvider implements IMediaProvider {
  resolveUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cdnUrl = process.env.CDN_URL;
    if (cdnUrl) {
      return `${cdnUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
    const apiHost = process.env.API_HOST || 'http://localhost:4000';
    return `${apiHost.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
