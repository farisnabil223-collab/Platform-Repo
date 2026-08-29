export interface IKeyVaultProvider {
  encryptPrivateKey(rawKey: string): Promise<string>;
  decryptPrivateKey(encryptedKey: string): Promise<string>;
}

export interface IDistributedLock {
  acquireLock(lockKey: string, ttlMs: number): Promise<boolean>;
  releaseLock(lockKey: string): Promise<void>;
}

export interface IPlugin {
  name: string;
  version: string;
  getCapabilities(): string[];
}

export class PluginRegistry {
  private plugins = new Map<string, IPlugin>();

  register(plugin: IPlugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  get(name: string): IPlugin | undefined {
    return this.plugins.get(name);
  }

  getAllCapabilities(): Record<string, string[]> {
    const caps: Record<string, string[]> = {};
    for (const [name, plugin] of this.plugins.entries()) {
      caps[name] = plugin.getCapabilities();
    }
    return caps;
  }
}
