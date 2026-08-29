import { DomainEvent } from '@eduverse/kernel';

export class ReviewCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly courseId: string,
    public readonly authorName: string,
    public readonly rating: number,
    public readonly content: string
  ) {
    super(aggregateId);
  }
}
