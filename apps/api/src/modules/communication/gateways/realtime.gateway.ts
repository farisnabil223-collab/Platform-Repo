import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { IRealtimeGateway, IRealtimeConnectionManager } from '@eduverse/kernel';

@Injectable()
@WebSocketGateway({ cors: true, namespace: 'realtime' })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect, IRealtimeGateway, IRealtimeConnectionManager {
  @WebSocketServer()
  server!: Server;

  // Map of userId -> Set of socketIds
  private userConnections = new Map<string, Set<string>>();
  // Map of socketId -> userId
  private socketToUser = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.registerConnection(userId, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.removeConnection(client.id);
  }

  registerConnection(userId: string, socketId: string): void {
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(socketId);
    this.socketToUser.set(socketId, userId);
  }

  removeConnection(socketId: string): void {
    const userId = this.socketToUser.get(socketId);
    if (userId) {
      const connections = this.userConnections.get(userId);
      if (connections) {
        connections.delete(socketId);
        if (connections.size === 0) {
          this.userConnections.delete(userId);
        }
      }
      this.socketToUser.delete(socketId);
    }
  }

  getUserConnections(userId: string): string[] {
    const connections = this.userConnections.get(userId);
    return connections ? Array.from(connections) : [];
  }

  async sendMessageToUser(userId: string, event: string, payload: any): Promise<void> {
    const connections = this.getUserConnections(userId);
    for (const socketId of connections) {
      this.server.to(socketId).emit(event, payload);
    }
  }

  async sendMessageToRoom(roomId: string, event: string, payload: any): Promise<void> {
    this.server.to(roomId).emit(event, payload);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      client.broadcast.to(data.conversationId).emit('typing', {
        userId,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
    }
  }
}
