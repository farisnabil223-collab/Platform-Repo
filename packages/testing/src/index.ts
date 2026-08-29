import { prisma } from '@eduverse/database';

export class DatabaseTestHelper {
  /**
   * Truncate all tables in the Postgres database.
   * Useful for cleaning up database states between integration tests.
   */
  static async truncateAll(): Promise<void> {
    const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    if (!tables) return;

    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.error('Error truncating tables:', error);
    }
  }
}

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

/**
 * Helper to generate simple mocks for dependencies.
 */
export function createMockFactory<T>(
  methods: Array<keyof T> = []
): () => MockType<T> {
  return () => {
    const mock: MockType<T> = {};
    for (const method of methods) {
      mock[method] = jest.fn();
    }
    return mock;
  };
}

export { Test, TestingModule } from '@nestjs/testing';
export * from '@nestjs/testing';
export { prisma };
export * from './testcontainers';
