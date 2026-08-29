import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class MediaLibraryService {
  async createFolder(name: string, parentId?: string) {
    return prisma.mediaFolder.create({
      data: {
        id: generateUuidV7(),
        name,
        parentId,
      },
    });
  }

  async uploadAsset(title: string, storageProvider: string, storagePath: string, folderId?: string) {
    return prisma.mediaAsset.create({
      data: {
        id: generateUuidV7(),
        title,
        storageProvider,
        storagePath,
        status: 'UPLOADED',
      },
    });
  }

  async listFolders() {
    return prisma.mediaFolder.findMany({
      include: { assets: true },
    });
  }

  async trackUsage(mediaAssetId: string, entityType: string, entityId: string) {
    return prisma.mediaUsage.create({
      data: {
        id: generateUuidV7(),
        mediaAssetId,
        entityType,
        entityId,
      },
    });
  }
}
