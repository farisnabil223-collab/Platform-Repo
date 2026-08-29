export interface IStorageProvider {
  uploadFile(key: string, fileBuffer: Buffer, mimeType: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string): Promise<string>;
}
