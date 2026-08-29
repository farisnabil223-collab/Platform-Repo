import { DomainEvent } from './domain-event';

export interface IDomainEventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventClassName: string,
    callback: (event: T) => Promise<void> | void
  ): void;
}

export class DomainEventBus implements IDomainEventBus {
  private static instance: DomainEventBus;
  private handlers: Map<string, Array<(event: any) => Promise<void> | void>> = new Map();

  private constructor() {}

  public static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const callbacks = this.handlers.get(eventName);
    if (callbacks) {
      await Promise.all(callbacks.map((callback) => callback(event)));
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }

  subscribe<T extends DomainEvent>(
    eventClassName: string,
    callback: (event: T) => Promise<void> | void
  ): void {
    if (!this.handlers.has(eventClassName)) {
      this.handlers.set(eventClassName, []);
    }
    this.handlers.get(eventClassName)!.push(callback);
  }
}
