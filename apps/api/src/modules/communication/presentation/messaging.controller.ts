import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { CreateConversationDto, SendMessageDto, PinMessageDto, CreateAnnouncementDto, ReportContentDto } from '../dto/communication.dto';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@ApiTags('Messaging & Announcements Bounded Context')
@Controller('communication')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor() {}

  @Post('conversations')
  @ApiOperation({ summary: 'Initiate a new direct or group chat conversation' })
  async createConversation(@Body() dto: CreateConversationDto, @Request() req: any) {
    const id = generateUuidV7();
    const conversation = await prisma.conversation.create({
      data: {
        id,
        title: dto.title,
        isGroup: dto.isGroup,
        members: {
          create: [
            { id: generateUuidV7(), userId: req.user.id, role: 'OWNER' },
            ...dto.members.map(userId => ({
              id: generateUuidV7(),
              userId,
              role: 'MEMBER',
            })),
          ],
        },
      },
    });

    // Write Outbox Event
    await prisma.outboxEvent.create({
      data: {
        id: generateUuidV7(),
        aggregate: 'Conversation',
        eventType: 'ConversationCreated',
        payload: conversation as any,
      },
    });

    return conversation;
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send message into conversation room' })
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @Request() req: any
  ) {
    const messageId = generateUuidV7();

    // Transactionally write message and outbox record
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          id: messageId,
          conversationId: id,
          senderId: req.user.id,
          content: dto.content,
          attachments: {
            create: dto.attachments?.map(path => ({
              id: generateUuidV7(),
              filePath: path,
              fileSize: 1024,
              mimeType: 'image/jpeg',
            })) || [],
          },
        },
      }),
      prisma.outboxEvent.create({
        data: {
          id: generateUuidV7(),
          aggregate: 'Message',
          eventType: 'MessageCreated',
          payload: {
            id: messageId,
            conversationId: id,
            senderId: req.user.id,
            content: dto.content,
          } as any,
        },
      }),
    ]);

    return message;
  }

  @Put('messages/:messageId/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pin message inside chat conversation room' })
  async pinMessage(@Param('messageId') messageId: string, @Body() dto: PinMessageDto) {
    return prisma.message.update({
      where: { id: messageId },
      data: { isPinned: dto.isPinned },
    });
  }

  @Post('announcements')
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create and target announcement to audience categories' })
  async createAnnouncement(@Body() dto: CreateAnnouncementDto) {
    const id = generateUuidV7();
    const announcement = await prisma.announcement.create({
      data: {
        id,
        code: dto.code,
        title: dto.title,
        content: dto.content,
        audienceType: dto.audienceType as any,
        audienceId: dto.audienceId,
        priority: dto.priority as any,
        publishAt: new Date(dto.publishAt),
        expireAt: dto.expireAt ? new Date(dto.expireAt) : null,
      },
    });

    await prisma.outboxEvent.create({
      data: {
        id: generateUuidV7(),
        aggregate: 'Announcement',
        eventType: 'AnnouncementPublished',
        payload: announcement as any,
      },
    });

    return announcement;
  }

  @Post('moderation/report/:contentType/:contentId')
  @ApiOperation({ summary: 'Flag content or messages for abuse review' })
  async reportContent(
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
    @Body() dto: ReportContentDto,
    @Request() req: any
  ) {
    return prisma.moderationReport.create({
      data: {
        id: generateUuidV7(),
        contentType,
        contentId,
        reporterId: req.user.id,
        reason: dto.reason,
      },
    });
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Query conversation messages with cursor pagination' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async queryMessages(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '20'
  ) {
    const l = Math.max(1, parseInt(limit));
    const queryParams: any = {
      take: l + 1,
      where: { conversationId: id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    };

    if (cursor) {
      queryParams.cursor = { id: cursor };
      queryParams.skip = 1;
    }

    const items = await prisma.message.findMany(queryParams);
    const hasNextPage = items.length > l;
    const resultItems = hasNextPage ? items.slice(0, l) : items;
    const nextCursor = hasNextPage ? resultItems[resultItems.length - 1].id : null;

    return {
      items: resultItems,
      nextCursor,
    };
  }
}
