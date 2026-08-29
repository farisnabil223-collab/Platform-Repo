import { AggregateRoot } from './aggregate-root';
import { BaseEntity } from './base-entity';
import {
  NotificationId,
  MessageId,
  ConversationId,
  AnnouncementCode,
  TemplateCode,
  LiveEventCode,
  DeliveryStatus,
  Channel,
  Priority,
  ReactionType
} from './communication-value-objects';

export interface NotificationProps {
  userId: string;
  code: string;
  priority: Priority;
  payload: Record<string, any>;
  retryCount: number;
  createdAt: Date;
}

export class Notification extends AggregateRoot<NotificationProps> {
  constructor(id: string, props: NotificationProps, version = 1) {
    super(id, props, version);
  }

  get userId() { return this.props.userId; }
  get code() { return this.props.code; }
  get priority() { return this.props.priority; }
  get payload() { return this.props.payload; }
  get retryCount() { return this.props.retryCount; }
}

export interface NotificationTemplateProps {
  code: TemplateCode;
  locale: string;
  subject?: string;
  bodyHtml?: string;
  bodyMarkdown?: string;
  channel: Channel;
}

export class NotificationTemplate extends BaseEntity<NotificationTemplateProps> {
  constructor(id: string, props: NotificationTemplateProps) {
    super(id, props);
  }

  get code() { return this.props.code; }
  get locale() { return this.props.locale; }
  get subject() { return this.props.subject; }
  get bodyHtml() { return this.props.bodyHtml; }
  get bodyMarkdown() { return this.props.bodyMarkdown; }
  get channel() { return this.props.channel; }
}

export interface NotificationPreferenceProps {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  digestFrequency: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  preferredLanguage: string;
  minPriority: Priority;
}

export class NotificationPreference extends AggregateRoot<NotificationPreferenceProps> {
  constructor(id: string, props: NotificationPreferenceProps, version = 1) {
    super(id, props, version);
  }

  get userId() { return this.props.userId; }
  get emailEnabled() { return this.props.emailEnabled; }
  get pushEnabled() { return this.props.pushEnabled; }
  get smsEnabled() { return this.props.smsEnabled; }
  get inAppEnabled() { return this.props.inAppEnabled; }
  get digestFrequency() { return this.props.digestFrequency; }
  get quietHoursStart() { return this.props.quietHoursStart; }
  get quietHoursEnd() { return this.props.quietHoursEnd; }
  get preferredLanguage() { return this.props.preferredLanguage; }
  get minPriority() { return this.props.minPriority; }
}

export interface AnnouncementProps {
  code: AnnouncementCode;
  title: string;
  content: string;
  audienceType: string;
  audienceId?: string;
  priority: Priority;
  publishAt: Date;
  expireAt?: Date;
  attachments: string[];
  createdAt: Date;
}

export class Announcement extends AggregateRoot<AnnouncementProps> {
  constructor(id: string, props: AnnouncementProps, version = 1) {
    super(id, props, version);
  }

  get code() { return this.props.code; }
  get title() { return this.props.title; }
  get content() { return this.props.content; }
  get audienceType() { return this.props.audienceType; }
  get audienceId() { return this.props.audienceId; }
  get priority() { return this.props.priority; }
  get publishAt() { return this.props.publishAt; }
  get expireAt() { return this.props.expireAt; }
  get attachments() { return this.props.attachments; }
}

export interface ConversationProps {
  title?: string;
  isGroup: boolean;
  createdAt: Date;
}

export class Conversation extends AggregateRoot<ConversationProps> {
  constructor(id: string, props: ConversationProps, version = 1) {
    super(id, props, version);
  }

  get title() { return this.props.title; }
  get isGroup() { return this.props.isGroup; }
}

export interface ConversationMemberProps {
  conversationId: string;
  userId: string;
  role: string;
  joinedAt: Date;
}

export class ConversationMember extends BaseEntity<ConversationMemberProps> {
  constructor(id: string, props: ConversationMemberProps) {
    super(id, props);
  }

  get conversationId() { return this.props.conversationId; }
  get userId() { return this.props.userId; }
  get role() { return this.props.role; }
  get joinedAt() { return this.props.joinedAt; }
}

export interface MessageProps {
  conversationId: ConversationId;
  senderId: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
}

export class Message extends AggregateRoot<MessageProps> {
  constructor(id: string, props: MessageProps, version = 1) {
    super(id, props, version);
  }

  get conversationId() { return this.props.conversationId; }
  get senderId() { return this.props.senderId; }
  get content() { return this.props.content; }
  get isPinned() { return this.props.isPinned; }
}

export interface MessageEditHistoryProps {
  messageId: MessageId;
  contentOld: string;
  contentNew: string;
  editedBy: string;
  editedAt: Date;
  reason?: string;
}

export class MessageEditHistory extends BaseEntity<MessageEditHistoryProps> {
  constructor(id: string, props: MessageEditHistoryProps) {
    super(id, props);
  }

  get messageId() { return this.props.messageId; }
  get contentOld() { return this.props.contentOld; }
  get contentNew() { return this.props.contentNew; }
  get editedBy() { return this.props.editedBy; }
  get editedAt() { return this.props.editedAt; }
  get reason() { return this.props.reason; }
}

export interface MessageAttachmentProps {
  messageId: MessageId;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isOptimized: boolean;
  scanStatus: string;
}

export class MessageAttachment extends BaseEntity<MessageAttachmentProps> {
  constructor(id: string, props: MessageAttachmentProps) {
    super(id, props);
  }

  get messageId() { return this.props.messageId; }
  get filePath() { return this.props.filePath; }
  get fileSize() { return this.props.fileSize; }
  get mimeType() { return this.props.mimeType; }
  get isOptimized() { return this.props.isOptimized; }
  get scanStatus() { return this.props.scanStatus; }
}

export interface MessageReactionProps {
  messageId: MessageId;
  userId: string;
  reaction: ReactionType;
  createdAt: Date;
}

export class MessageReaction extends BaseEntity<MessageReactionProps> {
  constructor(id: string, props: MessageReactionProps) {
    super(id, props);
  }

  get messageId() { return this.props.messageId; }
  get userId() { return this.props.userId; }
  get reaction() { return this.props.reaction; }
}

export interface DiscussionProps {
  contextType: string;
  contextId: string;
  title: string;
  createdAt: Date;
}

export class Discussion extends AggregateRoot<DiscussionProps> {
  constructor(id: string, props: DiscussionProps, version = 1) {
    super(id, props, version);
  }

  get contextType() { return this.props.contextType; }
  get contextId() { return this.props.contextId; }
  get title() { return this.props.title; }
}

export interface DiscussionThreadProps {
  discussionId: string;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
}

export class DiscussionThread extends AggregateRoot<DiscussionThreadProps> {
  constructor(id: string, props: DiscussionThreadProps, version = 1) {
    super(id, props, version);
  }

  get discussionId() { return this.props.discussionId; }
  get authorId() { return this.props.authorId; }
  get title() { return this.props.title; }
  get content() { return this.props.content; }
  get isPinned() { return this.props.isPinned; }
  get isLocked() { return this.props.isLocked; }
}

export interface DiscussionReplyProps {
  threadId: string;
  parentId?: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export class DiscussionReply extends AggregateRoot<DiscussionReplyProps> {
  constructor(id: string, props: DiscussionReplyProps, version = 1) {
    super(id, props, version);
  }

  get threadId() { return this.props.threadId; }
  get parentId() { return this.props.parentId; }
  get authorId() { return this.props.authorId; }
  get content() { return this.props.content; }
}

export interface LiveEventProps {
  code: LiveEventCode;
  title: string;
  description?: string;
  type: string;
  startTime: Date;
  endTime: Date;
  provider: string;
  providerEventId?: string;
  joinUrl?: string;
  recordingUrl?: string;
  captionsUrl?: string;
  transcriptUrl?: string;
  createdAt: Date;
}

export class LiveEvent extends AggregateRoot<LiveEventProps> {
  constructor(id: string, props: LiveEventProps, version = 1) {
    super(id, props, version);
  }

  get code() { return this.props.code; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get type() { return this.props.type; }
  get startTime() { return this.props.startTime; }
  get endTime() { return this.props.endTime; }
  get provider() { return this.props.provider; }
  get providerEventId() { return this.props.providerEventId; }
  get joinUrl() { return this.props.joinUrl; }
  get recordingUrl() { return this.props.recordingUrl; }
  get captionsUrl() { return this.props.captionsUrl; }
  get transcriptUrl() { return this.props.transcriptUrl; }
}

export interface AttendanceProps {
  eventId: string;
  studentId: string;
  joinedAt: Date;
  leftAt?: Date;
}

export class Attendance extends BaseEntity<AttendanceProps> {
  constructor(id: string, props: AttendanceProps) {
    super(id, props);
  }

  get eventId() { return this.props.eventId; }
  get studentId() { return this.props.studentId; }
  get joinedAt() { return this.props.joinedAt; }
  get leftAt() { return this.props.leftAt; }
}

export interface DeliveryLogProps {
  notificationId: NotificationId;
  channel: Channel;
  status: DeliveryStatus;
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
}

export class DeliveryLog extends BaseEntity<DeliveryLogProps> {
  constructor(id: string, props: DeliveryLogProps) {
    super(id, props);
  }

  get notificationId() { return this.props.notificationId; }
  get channel() { return this.props.channel; }
  get status() { return this.props.status; }
  get errorMessage() { return this.props.errorMessage; }
  get sentAt() { return this.props.sentAt; }
  get deliveredAt() { return this.props.deliveredAt; }
  get readAt() { return this.props.readAt; }
}
