import { Injectable } from '@nestjs/common';
import { CacheService } from '@eduverse/cache';
import { ICacheProvider } from '../domain/cache-provider.interface';

@Injectable()
export class RedisCacheProvider implements ICacheProvider {
  constructor(private readonly cacheService: CacheService) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cacheService.get<T>(key);
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    await this.cacheService.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.cacheService.del(key);
  }
}
