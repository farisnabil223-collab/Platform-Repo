import { LocalStorageProvider, StorageService } from './index';

describe('StorageService (Sprint 15 Production Storage Audit)', () => {
  let service: StorageService;
  let localProvider: LocalStorageProvider;

  beforeEach(() => {
    service = new StorageService();
    localProvider = new LocalStorageProvider();
  });

  it('should upload file and return file URI', async () => {
    const buffer = Buffer.from('test image data');
    const result = await service.upload('test-key.txt', buffer, 'text/plain');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should delete file successfully', async () => {
    const buffer = Buffer.from('deletable data');
    await localProvider.uploadFile('delete-me.txt', buffer, 'text/plain');
    const success = await localProvider.deleteFile('delete-me.txt');
    expect(success).toBe(true);
  });
});
