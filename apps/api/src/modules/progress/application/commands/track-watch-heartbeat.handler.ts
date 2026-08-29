import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma, MediaAssetRepository } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class TrackWatchHeartbeatHandler {
  constructor(private readonly mediaRepository: MediaAssetRepository) {}

  async execute(mediaAssetId: string, studentId: string, secondsOffset: number): Promise<void> {
    const asset = await this.mediaRepository.findById(mediaAssetId);
    if (!asset) {
      throw new BadRequestException('Media asset not found');
    }

    await prisma.watchHistory.upsert({
      where: {
        studentId_mediaAssetId: { studentId, mediaAssetId },
      },
      update: {
        secondsOffset,
        lastHeartbeat: new Date(),
      },
      create: {
        id: generateUuidV7(),
        studentId,
        mediaAssetId,
        secondsOffset,
        lastHeartbeat: new Date(),
      },
    });
  }
}
