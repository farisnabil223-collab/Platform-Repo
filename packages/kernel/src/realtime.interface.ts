export interface IRealtimeGateway {
  sendMessageToUser(userId: string, event: string, payload: any): Promise<void>;
  sendMessageToRoom(roomId: string, event: string, payload: any): Promise<void>;
}

export interface IRealtimeConnectionManager {
  registerConnection(userId: string, socketId: string): void;
  removeConnection(socketId: string): void;
  getUserConnections(userId: string): string[];
}
