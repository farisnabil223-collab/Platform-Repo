import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class CreateConversationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string; // DIRECT, GROUP
}

class SendMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  conversationId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;
}

@ApiTags('Chat Messaging Center')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  @Get('conversations')
  @ApiOperation({ summary: 'List all user chat conversations' })
  async getConversations() {
    const list = await prisma.conversation.findMany();
    return { success: true, data: list };
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new group or direct conversation' })
  async createConversation(@Body() dto: CreateConversationDto) {
    const chat = await prisma.conversation.create({
      data: {
        id: generateUuidV7(),
        title: dto.title,
        isGroup: dto.type === 'GROUP',
      },
    });
    return { success: true, data: chat };
  }

  @Get('messages')
  @ApiOperation({ summary: 'List messages in a conversation' })
  async getMessages(@Query('conversationId') convId: string) {
    const list = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: 'asc' },
    });
    return { success: true, data: list };
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a new message to a conversation' })
  async sendMessage(@Body() dto: SendMessageDto) {
    const msg = await prisma.message.create({
      data: {
        id: generateUuidV7(),
        conversationId: dto.conversationId,
        senderId: dto.senderId,
        content: dto.content,
      },
    });
    return { success: true, data: msg };
  }
}
