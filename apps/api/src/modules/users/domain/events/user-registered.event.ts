import { DomainEvent } from '@eduverse/kernel';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly role: string
  ) {
    super(aggregateId);
  }
}
