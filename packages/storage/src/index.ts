import { Injectable, Module, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

export interface StorageMetadata {
  size: number;
  contentType: string;
  lastModified?: Date;
}

export interface StorageProvider {
  uploadFile(key: string, fileBuffer: Buffer, mimeType: string): Promise<string>;
  deleteFile(key: string): Promise<boolean>;
  getSignedUrl(key: string, expiresSeconds?: number): Promise<string>;
  getFileMetadata(key: string): Promise<StorageMetadata>;
}

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private basePath = process.env.STORAGE_LOCAL_PATH || './uploads';

  constructor() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async uploadFile(key: string, fileBuffer: Buffer, _mimeType: string): Promise<string> {
    const fullPath = path.join(this.basePath, key);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(fullPath, fileBuffer);
    return `file://${path.resolve(fullPath)}`;
  }

  async deleteFile(key: string): Promise<boolean> {
    const fullPath = path.join(this.basePath, key);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  }

  async getSignedUrl(key: string, _expiresSeconds = 3600): Promise<string> {
    const fullPath = path.join(this.basePath, key);
    return `file://${path.resolve(fullPath)}`;
  }

  async getFileMetadata(key: string): Promise<StorageMetadata> {
    const fullPath = path.join(this.basePath, key);
    const stat = await fs.promises.stat(fullPath);
    return {
      size: stat.size,
      contentType: 'application/octet-stream',
      lastModified: stat.mtime,
    };
  }
}

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || '';
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || '';
    const endpoint = process.env.S3_ENDPOINT;

    if (process.env.NODE_ENV === 'production') {
      if (!this.bucket) throw new Error('S3_BUCKET is required for production storage.');
      if (!accessKeyId || !secretAccessKey) throw new Error('S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are required for production storage.');
    }

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle: !!endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`Initialized S3 Storage Provider (Bucket: ${this.bucket || 'unconfigured'}, Region: ${region})`);
  }

  async uploadFile(key: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );
    const endpoint = process.env.S3_ENDPOINT;
    if (endpoint) {
      return `${endpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to delete object ${key}: ${err.message}`);
      return false;
    }
  }

  async getSignedUrl(key: string, _expiresSeconds = 3600): Promise<string> {
    const endpoint = process.env.S3_ENDPOINT;
    if (endpoint) {
      return `${endpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }

  async getFileMetadata(key: string): Promise<StorageMetadata> {
    const res = await this.client.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
    return {
      size: res.ContentLength || 0,
      contentType: res.ContentType || 'application/octet-stream',
      lastModified: res.LastModified,
    };
  }
}

@Injectable()
export class StorageService {
  private provider: StorageProvider;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    const driver = process.env.STORAGE_DRIVER || (process.env.NODE_ENV === 'production' ? 's3' : 'local');
    if (driver === 's3') {
      this.provider = new S3StorageProvider();
    } else {
      if (process.env.NODE_ENV === 'production') {
        this.logger.warn('WARNING: Using LocalStorageProvider in production environment is discouraged!');
      }
      this.provider = new LocalStorageProvider();
    }
  }

  async upload(key: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    return this.provider.uploadFile(key, fileBuffer, mimeType);
  }

  async delete(key: string): Promise<boolean> {
    return this.provider.deleteFile(key);
  }

  async getSignedUrl(key: string, expiresSeconds?: number): Promise<string> {
    return this.provider.getSignedUrl(key, expiresSeconds);
  }

  async getMetadata(key: string): Promise<StorageMetadata> {
    return this.provider.getFileMetadata(key);
  }
}

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
