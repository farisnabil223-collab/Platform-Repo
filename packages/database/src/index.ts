import { PrismaClient } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

// Global PrismaClient cache in development to avoid hitting connection limits
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Generate a sortable, database-compatible UUID v7.
 */
export function generateUuidV7(): string {
  return uuidv7();
}

export * from '@prisma/client';
export { uuidv7 };
export * from './prisma-repository';
export * from './prisma-unit-of-work';
export * from './user.repository';
export * from './session.repository';
export * from './device.repository';
export * from './role.repository';
export * from './academic-repositories';
export * from './learning-repositories';
export * from './assessment-repositories';
export * from './communication-repositories';
export * from './credential-repositories';
export * from './payment-repositories';
export * from './analytics-repositories';
export * from './tenant-repositories';
export * from './base-tenant-repository';
export * from './ai-repositories';
export * from './integration-repositories';
export * from './infra-repositories';
export * from './gov-repositories';
export * from './research-repositories';
export * from './alumni-repositories';
export * from './global-repositories';
export * from './marketplace-repositories';
export * from './workflow-repositories';
export * from './builder-repositories';
export * from './data-repositories';
export * from './obs-repositories';
export * from './sec-repositories';
export * from './ai-platform-repositories';
export * from './infra-platform-repositories';
export * from './ops-platform-repositories';
export * from './pe-platform-repositories';
export * from './gov-compliance-repositories';
export * from './saas-platform-repositories';

