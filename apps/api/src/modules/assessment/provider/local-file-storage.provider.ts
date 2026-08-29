import { Injectable } from '@nestjs/common';
import { IFileStorageProvider } from '../domain/file-storage.provider.interface';

@Injectable()
export class LocalFileStorageProvider implements IFileStorageProvider {
  async uploadFile(file: any): Promise<string> {
    return `uploads/assessments/${Date.now()}_file.pdf`;
  }

  async getDownloadUrl(fileUrl: string): Promise<string> {
    return `${fileUrl}?expires=${Math.floor(Date.now() / 1000) + 3600}`;
  }
}
