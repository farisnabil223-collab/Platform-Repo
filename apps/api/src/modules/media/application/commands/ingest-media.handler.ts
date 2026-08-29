import { Injectable, ConflictException } from '@nestjs/common';
import { MediaAssetRepository, prisma } from '@eduverse/database';
import { MediaAsset, generateUuidV7 } from '@eduverse/kernel';
import { IngestMediaDto } from '../../dto/media.dto';

@Injectable()
export class IngestMediaHandler {
  constructor(private readonly mediaRepository: MediaAssetRepository) {}

  async execute(dto: IngestMediaDto): Promise<MediaAsset> {
    const existing = await this.mediaRepository.findByStoragePath(dto.storagePath);
    if (existing) {
      throw new ConflictException('Media asset path already exists');
    }

    const asset = new MediaAsset(generateUuidV7(), {
      title: dto.title,
      storageProvider: dto.storageProvider,
      storagePath: dto.storagePath,
      status: 'UPLOADED',
    });

    await this.mediaRepository.save(asset);

    // Register media processing job entry
    const queueName = `${dto.mediaType.toLowerCase()}_queue`;
    await prisma.mediaProcessingJob.create({
      data: {
        id: generateUuidV7(),
        mediaAssetId: asset.id,
        queueName,
        status: 'QUEUED',
      },
    });

    // Mock pipeline processing complete (production mock: sets status ready immediately for testing flow)
    asset.updateStatus('READY');
    await this.mediaRepository.save(asset);

    return asset;
  }
}
