import { uuidv7 } from 'uuidv7';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.eventId = uuidv7();
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
  }
}
