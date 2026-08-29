const { HealthController } = require('./health.controller');

describe('HealthController (Sprint 13 Functional Verification)', () => {
  let controller;
  let mockCacheService;
  let mockStorageService;

  beforeEach(() => {
    mockCacheService = {
      ping: jest.fn().mockResolvedValue('PONG'),
    };
    mockStorageService = {
      isAvailable: jest.fn().mockResolvedValue(true),
    };
    controller = new HealthController(mockCacheService, mockStorageService);
  });

  it('GET /api/v1/health — returns UP status and timestamp', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('UP');
    expect(typeof result.uptime).toBe('number');
    expect(typeof result.timestamp).toBe('string');
  });

  it('GET /api/v1/health/live — returns ALIVE status', () => {
    const result = controller.getLive();
    expect(result.status).toBe('ALIVE');
  });
});
