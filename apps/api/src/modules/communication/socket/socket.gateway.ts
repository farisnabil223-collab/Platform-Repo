import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PresenceService } from '../presence/presence.service';
import { UseFilters, UsePipes, ValidationPipe, Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly presenceService: PresenceService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await this.presenceService.trackConnection(userId, client.id);
      await this.presenceService.updateUserPresence(userId, 'ONLINE');
      this.logger.log(`Client connected: Socket ID ${client.id}, User ID ${userId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    await this.presenceService.removeConnection(client.id);
    if (userId) {
      await this.presenceService.updateUserPresence(userId, 'OFFLINE');
    }
    this.logger.log(`Client disconnected: Socket ID ${client.id}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.handshake.query.userId as string;
    client.to(data.conversationId).emit('typing', {
      userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('read_receipt')
  handleReadReceipt(
    @MessageBody() data: { conversationId: string; messageId: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.handshake.query.userId as string;
    client.to(data.conversationId).emit('read_receipt', {
      messageId: data.messageId,
      userId,
      readAt: new Date(),
    });
  }
}
