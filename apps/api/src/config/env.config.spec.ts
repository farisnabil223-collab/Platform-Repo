const { getJwtSecret, validateEnv } = require('./env.config');

describe('Environment Configuration Security Hardening (P-003 Audit)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('Test 1 — Startup fails when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow('JWT_SECRET environment variable is missing.');
    expect(() => validateEnv()).toThrow('Environment validation failed with 1 error(s).');
  });

  it('Test 2 — Startup fails when JWT_SECRET is fewer than 32 characters', () => {
    process.env.JWT_SECRET = 'short_secret_12345';
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET must contain at least 32 characters/);
    expect(() => validateEnv()).toThrow('Environment validation failed with 1 error(s).');
  });

  it('Test 3 — Startup succeeds with valid 32+ character JWT_SECRET', () => {
    process.env.JWT_SECRET = 'super_secure_cryptographic_jwt_secret_key_32bytes_long!';
    process.env.NODE_ENV = 'development';
    const config = validateEnv();
    expect(config.jwtSecret).toBe('super_secure_cryptographic_jwt_secret_key_32bytes_long!');
    expect(getJwtSecret()).toBe('super_secure_cryptographic_jwt_secret_key_32bytes_long!');
  });
});
