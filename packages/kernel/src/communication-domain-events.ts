import { DomainEvent } from './domain-event';

export class NotificationCreatedEvent extends DomainEvent {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly code: string
  ) {
    super(notificationId);
  }
}

export class NotificationQueuedEvent extends DomainEvent {
  constructor(
    public readonly notificationId: string,
    public readonly channel: string
  ) {
    super(notificationId);
  }
}

export class NotificationDeliveredEvent extends DomainEvent {
  constructor(
    public readonly notificationId: string,
    public readonly channel: string
  ) {
    super(notificationId);
  }
}

export class NotificationReadEvent extends DomainEvent {
  constructor(public readonly notificationId: string) {
    super(notificationId);
  }
}

export class MessageCreatedEvent extends DomainEvent {
  constructor(
    public readonly messageId: string,
    public readonly conversationId: string,
    public readonly senderId: string
  ) {
    super(messageId);
  }
}

export class MessageEditedEvent extends DomainEvent {
  constructor(
    public readonly messageId: string,
    public readonly oldContent: string,
    public readonly newContent: string
  ) {
    super(messageId);
  }
}

export class MessageDeletedEvent extends DomainEvent {
  constructor(public readonly messageId: string) {
    super(messageId);
  }
}

export class ConversationCreatedEvent extends DomainEvent {
  constructor(
    public readonly conversationId: string,
    public readonly title?: string
  ) {
    super(conversationId);
  }
}

export class UserMentionedEvent extends DomainEvent {
  constructor(
    public readonly messageId: string,
    public readonly userId: string
  ) {
    super(messageId);
  }
}

export class AnnouncementPublishedEvent extends DomainEvent {
  constructor(
    public readonly announcementId: string,
    public readonly code: string,
    public readonly title: string
  ) {
    super(announcementId);
  }
}

export class AnnouncementExpiredEvent extends DomainEvent {
  constructor(public readonly announcementId: string) {
    super(announcementId);
  }
}

export class LiveEventCreatedEvent extends DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly code: string,
    public readonly title: string
  ) {
    super(eventId);
  }
}

export class LiveEventStartedEvent extends DomainEvent {
  constructor(public readonly eventId: string) {
    super(eventId);
  }
}

export class LiveEventEndedEvent extends DomainEvent {
  constructor(public readonly eventId: string) {
    super(eventId);
  }
}

export class PresenceChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly state: string,
    public readonly lastSeen: Date
  ) {
    super(userId);
  }
}
