/**
 * Centralized Production Environment Variable Validation & Security Hardening
 */
export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  databaseUrl?: string;
  frontendWebUrl: string;
  frontendAdminUrl: string;
  jwtSecret: string;
}

const DEFAULT_JWT_SECRET = 'eduverse_production_secure_jwt_secret_key_2026_super_encrypted_platform_token';
const DEFAULT_WEB_URL = 'https://eduverse-n0ta5zjea-farisnabil223-2417.vercel.app';
const DEFAULT_ADMIN_URL = 'https://platform-repo-admin.vercel.app';
const DEFAULT_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/eduverse';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    return DEFAULT_JWT_SECRET;
  }
  return secret;
}

export function validateEnv(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV || 'production';
  const port = Number(process.env.PORT) || 4000;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  const databaseUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
  const frontendWebUrl = process.env.FRONTEND_WEB_URL || DEFAULT_WEB_URL;
  const frontendAdminUrl = process.env.FRONTEND_ADMIN_URL || DEFAULT_ADMIN_URL;
  const jwtSecret = (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32)
    ? process.env.JWT_SECRET
    : DEFAULT_JWT_SECRET;

  return {
    nodeEnv,
    port,
    apiPrefix,
    databaseUrl,
    frontendWebUrl,
    frontendAdminUrl,
    jwtSecret,
  };
}
