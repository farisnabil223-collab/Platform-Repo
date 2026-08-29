import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string;
  correlationId?: string;
  traceId?: string;
}

export class TenantContextAccessor {
  private static asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

  static runWithContext<T>(context: TenantContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  static getContext(): TenantContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  static getTenantId(): string | undefined {
    return this.getContext()?.tenantId;
  }
}
