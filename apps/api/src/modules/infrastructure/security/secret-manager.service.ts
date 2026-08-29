import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class SecretManagerService {
  async saveSecret(orgId: string, provider: string, value: string) {
    return prisma.secretStore.create({
      data: {
        id: generateUuidV7(),
        organizationId: orgId,
        provider,
        encryptedValue: value,
        version: 1,
      },
    });
  }

  async rotateKey(version: number, tenantId?: string) {
    return prisma.encryptionKey.create({
      data: {
        id: generateUuidV7(),
        tenantId: tenantId || generateUuidV7(),
        keyName: `key-v${version}`,
        algorithm: 'AES_256_GCM',
        keyVersion: version,
        isEnabled: true,
      },
    });
  }
}
