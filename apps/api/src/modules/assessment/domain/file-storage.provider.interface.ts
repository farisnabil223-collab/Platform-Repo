export interface IFileStorageProvider {
  uploadFile(file: any): Promise<string>;
  getDownloadUrl(fileUrl: string): Promise<string>;
}

export const IFileStorageProvider = Symbol('IFileStorageProvider');
