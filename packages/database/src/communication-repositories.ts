import {
  INotificationRepository,
  IAnnouncementRepository,
  IConversationRepository,
  IMessageRepository,
  ILiveEventRepository,
  Notification,
  Announcement,
  Conversation,
  Message,
  LiveEvent,
  AnnouncementCode,
  LiveEventCode,
  ConversationId
} from '@eduverse/kernel';
import { prisma } from './index';

export class NotificationRepository implements INotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    const row = await prisma.notification.findUnique({ where: { id } });
    if (!row) return null;
    return new Notification(row.id, {
      userId: row.userId,
      code: row.code,
      priority: row.priority as any,
      payload: row.payload as any,
      retryCount: row.retryCount,
      createdAt: row.createdAt,
    });
  }

  async findAll(): Promise<Notification[]> {
    const rows = await prisma.notification.findMany();
    return rows.map(
      row =>
        new Notification(row.id, {
          userId: row.userId,
          code: row.code,
          priority: row.priority as any,
          payload: row.payload as any,
          retryCount: row.retryCount,
          createdAt: row.createdAt,
        })
    );
  }

  async save(entity: Notification): Promise<void> {
    await prisma.notification.upsert({
      where: { id: entity.id },
      update: {
        userId: entity.userId,
        code: entity.code,
        priority: entity.priority as any,
        payload: entity.payload as any,
        retryCount: entity.retryCount,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        code: entity.code,
        priority: entity.priority as any,
        payload: entity.payload as any,
        retryCount: entity.retryCount,
        createdAt: entity.createdAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.notification.delete({ where: { id } });
  }
}

export class AnnouncementRepository implements IAnnouncementRepository {
  async findById(id: string): Promise<Announcement | null> {
    const row = await prisma.announcement.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Announcement(row.id, {
      code: new AnnouncementCode(row.code),
      title: row.title,
      content: row.content,
      audienceType: row.audienceType,
      audienceId: row.audienceId || undefined,
      priority: row.priority as any,
      publishAt: row.publishAt,
      expireAt: row.expireAt || undefined,
      attachments: row.attachments,
      createdAt: row.createdAt,
    }, row.version);
  }

  async findByCode(code: string): Promise<Announcement | null> {
    const row = await prisma.announcement.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Announcement(row.id, {
      code: new AnnouncementCode(row.code),
      title: row.title,
      content: row.content,
      audienceType: row.audienceType,
      audienceId: row.audienceId || undefined,
      priority: row.priority as any,
      publishAt: row.publishAt,
      expireAt: row.expireAt || undefined,
      attachments: row.attachments,
      createdAt: row.createdAt,
    }, row.version);
  }

  async findAll(): Promise<Announcement[]> {
    const rows = await prisma.announcement.findMany({ where: { deletedAt: null } });
    return rows.map(
      row =>
        new Announcement(row.id, {
          code: new AnnouncementCode(row.code),
          title: row.title,
          content: row.content,
          audienceType: row.audienceType,
          audienceId: row.audienceId || undefined,
          priority: row.priority as any,
          publishAt: row.publishAt,
          expireAt: row.expireAt || undefined,
          attachments: row.attachments,
          createdAt: row.createdAt,
        }, row.version)
    );
  }

  async save(entity: Announcement): Promise<void> {
    await prisma.announcement.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        content: entity.content,
        audienceType: entity.audienceType as any,
        audienceId: entity.audienceId,
        priority: entity.priority as any,
        publishAt: entity.publishAt,
        expireAt: entity.expireAt,
        attachments: entity.attachments,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        code: entity.code.value,
        title: entity.title,
        content: entity.content,
        audienceType: entity.audienceType as any,
        audienceId: entity.audienceId,
        priority: entity.priority as any,
        publishAt: entity.publishAt,
        expireAt: entity.expireAt,
        attachments: entity.attachments,
        createdAt: entity.createdAt,
        version: 1,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.announcement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class ConversationRepository implements IConversationRepository {
  async findById(id: string): Promise<Conversation | null> {
    const row = await prisma.conversation.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Conversation(row.id, {
      title: row.title || undefined,
      isGroup: row.isGroup,
      createdAt: row.createdAt,
    });
  }

  async findAll(): Promise<Conversation[]> {
    const rows = await prisma.conversation.findMany({ where: { deletedAt: null } });
    return rows.map(
      row =>
        new Conversation(row.id, {
          title: row.title || undefined,
          isGroup: row.isGroup,
          createdAt: row.createdAt,
        })
    );
  }

  async save(entity: Conversation): Promise<void> {
    await prisma.conversation.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        isGroup: entity.isGroup,
      },
      create: {
        id: entity.id,
        title: entity.title,
        isGroup: entity.isGroup,
        createdAt: entity.createdAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.conversation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class MessageRepository implements IMessageRepository {
  async findById(id: string): Promise<Message | null> {
    const row = await prisma.message.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Message(row.id, {
      conversationId: new ConversationId(row.conversationId),
      senderId: row.senderId,
      content: row.content,
      isPinned: row.isPinned,
      createdAt: row.createdAt,
    });
  }

  async findAll(): Promise<Message[]> {
    const rows = await prisma.message.findMany({ where: { deletedAt: null } });
    return rows.map(
      row =>
        new Message(row.id, {
          conversationId: new ConversationId(row.conversationId),
          senderId: row.senderId,
          content: row.content,
          isPinned: row.isPinned,
          createdAt: row.createdAt,
        })
    );
  }

  async save(entity: Message): Promise<void> {
    await prisma.message.upsert({
      where: { id: entity.id },
      update: {
        content: entity.content,
        isPinned: entity.isPinned,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        conversationId: entity.conversationId.value,
        senderId: entity.senderId,
        content: entity.content,
        isPinned: entity.isPinned,
        createdAt: entity.createdAt,
        version: 1,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class LiveEventRepository implements ILiveEventRepository {
  async findById(id: string): Promise<LiveEvent | null> {
    const row = await prisma.liveEvent.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new LiveEvent(row.id, {
      code: new LiveEventCode(row.code),
      title: row.title,
      description: row.description || undefined,
      type: row.type,
      startTime: row.startTime,
      endTime: row.endTime,
      provider: row.provider,
      providerEventId: row.providerEventId || undefined,
      joinUrl: row.joinUrl || undefined,
      recordingUrl: row.recordingUrl || undefined,
      captionsUrl: row.captionsUrl || undefined,
      transcriptUrl: row.transcriptUrl || undefined,
      createdAt: row.createdAt,
    });
  }

  async findByCode(code: string): Promise<LiveEvent | null> {
    const row = await prisma.liveEvent.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new LiveEvent(row.id, {
      code: new LiveEventCode(row.code),
      title: row.title,
      description: row.description || undefined,
      type: row.type,
      startTime: row.startTime,
      endTime: row.endTime,
      provider: row.provider,
      providerEventId: row.providerEventId || undefined,
      joinUrl: row.joinUrl || undefined,
      recordingUrl: row.recordingUrl || undefined,
      captionsUrl: row.captionsUrl || undefined,
      transcriptUrl: row.transcriptUrl || undefined,
      createdAt: row.createdAt,
    });
  }

  async findAll(): Promise<LiveEvent[]> {
    const rows = await prisma.liveEvent.findMany({ where: { deletedAt: null } });
    return rows.map(
      row =>
        new LiveEvent(row.id, {
          code: new LiveEventCode(row.code),
          title: row.title,
          description: row.description || undefined,
          type: row.type,
          startTime: row.startTime,
          endTime: row.endTime,
          provider: row.provider,
          providerEventId: row.providerEventId || undefined,
          joinUrl: row.joinUrl || undefined,
          recordingUrl: row.recordingUrl || undefined,
          captionsUrl: row.captionsUrl || undefined,
          transcriptUrl: row.transcriptUrl || undefined,
          createdAt: row.createdAt,
        })
    );
  }

  async save(entity: LiveEvent): Promise<void> {
    await prisma.liveEvent.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        description: entity.description,
        type: entity.type,
        startTime: entity.startTime,
        endTime: entity.endTime,
        provider: entity.provider,
        providerEventId: entity.providerEventId,
        joinUrl: entity.joinUrl,
        recordingUrl: entity.recordingUrl,
        captionsUrl: entity.captionsUrl,
        transcriptUrl: entity.transcriptUrl,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        code: entity.code.value,
        title: entity.title,
        description: entity.description,
        type: entity.type,
        startTime: entity.startTime,
        endTime: entity.endTime,
        provider: entity.provider,
        providerEventId: entity.providerEventId,
        joinUrl: entity.joinUrl,
        recordingUrl: entity.recordingUrl,
        captionsUrl: entity.captionsUrl,
        transcriptUrl: entity.transcriptUrl,
        createdAt: entity.createdAt,
        version: 1,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.liveEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
