import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { prisma } from '@eduverse/database';
import { RealtimeGateway } from '../gateways/realtime.gateway';

@Injectable()
@Processor('outbox-queue')
export class OutboxProcessor extends WorkerHost {
  constructor(private readonly realtimeGateway: RealtimeGateway) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const pendingEvents = await prisma.outboxEvent.findMany({
      where: { processedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    for (const event of pendingEvents) {
      try {
        const payloadObj = event.payload as any;

        // If it's a message event, broadcast it via WS
        if (event.aggregate === 'Message') {
          const conversationId = payloadObj.properties?.conversationId?.value || payloadObj.conversationId;
          await this.realtimeGateway.sendMessageToRoom(conversationId, event.eventType, payloadObj);
        } else if (event.aggregate === 'Notification') {
          const userId = payloadObj.properties?.userId || payloadObj.userId;
          await this.realtimeGateway.sendMessageToUser(userId, event.eventType, payloadObj);
        }

        // Mark processed
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { processedAt: new Date() },
        });
      } catch (err: any) {
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            attempts: { increment: 1 },
          },
        });
      }
    }
  }
}
