import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class StorageService {
  async uploadObject(bucketId: string, key: string, size: number, mimeType: string, checksum: string) {
    return prisma.storageObject.create({
      data: {
        id: generateUuidV7(),
        bucketId,
        objectKey: key,
        size,
        mimeType,
        checksum,
      },
    });
  }

  async getObject(objectId: string) {
    return prisma.storageObject.findUnique({
      where: { id: objectId },
    });
  }

  async deleteObject(objectId: string) {
    return prisma.storageObject.delete({
      where: { id: objectId },
    });
  }
}
