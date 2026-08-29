import { Module, Global, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private memoryFallback = new Map<string, { value: any; expiresAt?: number }>();

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return 1000;
      },
    });

    this.client.on('error', () => {
      // Gracefully catch redis errors to prevent unhandled process exceptions
    });
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch {
      // Ignore quit errors
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch {
      const fallback = this.memoryFallback.get(key);
      if (!fallback) return null;
      if (fallback.expiresAt && Date.now() > fallback.expiresAt) {
        this.memoryFallback.delete(key);
        return null;
      }
      return fallback.value as T;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      if (ttlSeconds) {
        await this.client.set(key, serializedValue, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch {
      const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
      this.memoryFallback.set(key, { value, expiresAt });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch {
      this.memoryFallback.delete(key);
    }
  }

  getClient(): Redis {
    return this.client;
  }
}

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}

