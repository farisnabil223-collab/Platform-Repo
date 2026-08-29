import { DomainEvent } from '@eduverse/kernel';

export class EnrollmentCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly studentId: string,
    public readonly courseId: string
  ) {
    super(aggregateId);
  }
}
