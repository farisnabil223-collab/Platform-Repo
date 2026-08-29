import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger(OutboxProcessorService.name);

  async processEvents() {
    const events = await prisma.outboxEvent.findMany({
      take: 20,
      orderBy: { createdAt: 'asc' },
    });

    if (events.length === 0) return;

    this.logger.log(`Processing ${events.length} outbox events...`);

    for (const event of events) {
      try {
        // Dispatching mock actions based on event type
        this.logger.log(`Dispatching event: ${event.eventType} (Aggregate: ${event.aggregate})`);

        // Successfully processed: Delete record to keep database clean
        await prisma.outboxEvent.delete({
          where: { id: event.id },
        });
      } catch (err: any) {
        this.logger.error(`Failed to process outbox event ${event.id}: ${err.message}`);
      }
    }
  }
}
