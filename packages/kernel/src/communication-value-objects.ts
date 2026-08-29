export class NotificationId {
  constructor(public readonly value: string) {}
}

export class MessageId {
  constructor(public readonly value: string) {}
}

export class ConversationId {
  constructor(public readonly value: string) {}
}

export class MentionId {
  constructor(public readonly value: string) {}
}

export class AnnouncementCode {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('ANN_')) {
      throw new Error(`Invalid AnnouncementCode format: ${value}`);
    }
  }
}

export class TemplateCode {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('TMP_')) {
      throw new Error(`Invalid TemplateCode format: ${value}`);
    }
  }
}

export class LiveEventCode {
  constructor(public readonly value: string) {
    if (!value || !value.startsWith('LIV_')) {
      throw new Error(`Invalid LiveEventCode format: ${value}`);
    }
  }
}

export type DeliveryStatus = 'CREATED' | 'QUEUED' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export type Channel = 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS' | 'WEBSOCKET';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type ReactionType = 'LIKE' | 'HEART' | 'THUMBS_UP' | 'CONGRATS' | 'CLAP';

export type UserPresenceState = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' | 'INVISIBLE';
