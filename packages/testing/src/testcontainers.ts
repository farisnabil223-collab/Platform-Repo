import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export class TestDatabaseContainer {
  private static container: StartedPostgreSqlContainer | null = null;

  public static async start(): Promise<string> {
    if (!this.container) {
      this.container = await new PostgreSqlContainer('postgres:17-alpine')
        .withDatabase('eduverse_test')
        .withUsername('postgres_test')
        .withPassword('postgres_test_pass')
        .start();
    }
    return this.container.getConnectionUri();
  }

  public static async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop();
      this.container = null;
    }
  }
}
