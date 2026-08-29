import { AsyncLocalStorage } from 'async_hooks';

export interface RequestStore {
  traceId: string;
  userId?: string;
  userRole?: string;
  clientIp?: string;
  userAgent?: string;
  correlationId?: string;
  startTime: number;
}

export class RequestContext {
  private static storage = new AsyncLocalStorage<RequestStore>();

  public static run(store: RequestStore, callback: () => void | Promise<void>): void {
    this.storage.run(store, callback);
  }

  public static getStore(): RequestStore | undefined {
    return this.storage.getStore();
  }

  public static getTraceId(): string {
    return this.getStore()?.traceId || 'SYSTEM';
  }

  public static getUserId(): string | undefined {
    return this.getStore()?.userId;
  }

  public static getUserRole(): string | undefined {
    return this.getStore()?.userRole;
  }
}
