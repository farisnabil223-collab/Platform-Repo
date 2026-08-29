export class AnalyticsCache {
  private cacheStore: Map<string, { value: any; expiresAt: number }> = new Map();

  set(key: string, value: any, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cacheStore.set(key, { value, expiresAt });
  }

  get(key: string): any | null {
    const cached = this.cacheStore.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cacheStore.delete(key);
      return null;
    }
    return cached.value;
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.cacheStore.keys()) {
      if (key.includes(pattern)) {
        this.cacheStore.delete(key);
      }
    }
  }

  clear(): void {
    this.cacheStore.clear();
  }
}
