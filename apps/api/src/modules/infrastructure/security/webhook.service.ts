import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class WebhookService {
  async registerEndpoint(orgId: string, url: string, secret: string) {
    return prisma.webhookEndpoint.create({
      data: {
        id: generateUuidV7(),
        organizationId: orgId,
        url,
        secret,
      },
    });
  }

  async logDelivery(endpointId: string, status: 'SUCCESS' | 'FAILED', code: number, duration: number) {
    return prisma.webhookEndpointDelivery.create({
      data: {
        id: generateUuidV7(),
        endpointId,
        status,
        statusCode: code,
        duration,
      },
    });
  }
}
