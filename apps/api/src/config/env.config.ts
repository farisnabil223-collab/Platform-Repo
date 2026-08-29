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

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  if (secret.length < 32) {
    throw new Error(`JWT_SECRET must contain at least 32 characters for cryptographic security (current length: ${secret.length}).`);
  }
  return secret;
}

export function validateEnv(): EnvironmentConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const errors: string[] = [];

  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = Number(process.env.PORT) || 4000;
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  const databaseUrl = process.env.DATABASE_URL;
  const frontendWebUrl = process.env.FRONTEND_WEB_URL || 'http://localhost:3000';
  const frontendAdminUrl = process.env.FRONTEND_ADMIN_URL || 'http://localhost:3001';
  const jwtSecret = process.env.JWT_SECRET;

  // Validate JWT Secret across all environments (No hardcoded fallback strings permitted)
  if (!jwtSecret || jwtSecret.trim().length === 0) {
    errors.push('JWT_SECRET environment variable is required.');
  } else if (jwtSecret.length < 32) {
    errors.push(`JWT_SECRET must contain at least 32 characters for cryptographic security (current length: ${jwtSecret.length}).`);
  }

  if (isProduction) {
    if (!databaseUrl) {
      errors.push('DATABASE_URL is required in production.');
    }
    if (!process.env.FRONTEND_WEB_URL) {
      errors.push('FRONTEND_WEB_URL is required in production for CORS security.');
    }
    if (!process.env.FRONTEND_ADMIN_URL) {
      errors.push('FRONTEND_ADMIN_URL is required in production for CORS security.');
    }
  }

  if (errors.length > 0) {
    console.error('==================================================================');
    console.error('CRITICAL ENVIRONMENT CONFIGURATION ERROR — STARTUP ABORTED');
    console.error('==================================================================');
    errors.forEach((err) => console.error(` - ${err}`));
    console.error('==================================================================');
    throw new Error(`Environment validation failed with ${errors.length} error(s).`);
  }

  return {
    nodeEnv,
    port,
    apiPrefix,
    databaseUrl,
    frontendWebUrl,
    frontendAdminUrl,
    jwtSecret: jwtSecret!,
  };
}
