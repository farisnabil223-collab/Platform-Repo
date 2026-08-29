import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IContentDeliveryProvider } from '../domain/content-delivery.provider.interface';

@Injectable()
export class LessonResourcesService {
  constructor(
    @Inject(IContentDeliveryProvider)
    private readonly cdnProvider: IContentDeliveryProvider
  ) {}

  async getResources(lessonId: string) {
    return prisma.lessonResource.findMany({
      where: { lessonId },
    });
  }

  async getDownloadUrl(resourceId: string): Promise<string> {
    const resource = await prisma.lessonResource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    // Call provider to generate a secure signed URL
    const signedUrl = await this.cdnProvider.generateSignedDownloadUrl(resource.fileUrl);

    // Track resource download event
    await prisma.learningTimelineEvent.create({
      data: {
        id: generateUuidV7(),
        userId: generateUuidV7(), // simulated system/student mapping ID
        lessonId: resource.lessonId,
        eventType: 'RESOURCE_DOWNLOADED',
        metadata: { resourceId, title: resource.title },
      },
    });

    return signedUrl;
  }
}
