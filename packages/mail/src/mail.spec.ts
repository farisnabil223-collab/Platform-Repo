import { MailService } from './index';

describe('MailService (Sprint 15 Production Mail Audit)', () => {
  let service: MailService;

  beforeEach(() => {
    service = new MailService();
    service.onModuleInit();
  });

  it('should initialize MailService with configured transport', () => {
    expect(service).toBeDefined();
  });
});
