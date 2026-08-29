import { Injectable, ForbiddenException } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class DeviceLifecycleService {
  async registerDevice(data: {
    orgId: string;
    userId: string;
    deviceId: string;
    platform: string;
    manufacturer: string;
    model: string;
    osVersion: string;
    appVersion: string;
    locale: string;
    timezone: string;
  }) {
    // Check if device is blocked
    const existing = await prisma.mobileDevice.findUnique({
      where: { deviceId: data.deviceId },
    });

    if (existing && existing.status === 'BLOCKED') {
      throw new ForbiddenException('Mobile device is blocked by administrator.');
    }

    return prisma.mobileDevice.upsert({
      where: { deviceId: data.deviceId },
      update: {
        lastSeenAt: new Date(),
        appVersion: data.appVersion,
        osVersion: data.osVersion,
      },
      create: {
        id: generateUuidV7(),
        organizationId: data.orgId,
        userId: data.userId,
        deviceId: data.deviceId,
        platform: data.platform,
        manufacturer: data.manufacturer,
        model: data.model,
        osVersion: data.osVersion,
        appVersion: data.appVersion,
        locale: data.locale,
        timezone: data.timezone,
        status: 'ACTIVE',
      },
    });
  }

  async blockDevice(deviceId: string) {
    return prisma.mobileDevice.update({
      where: { deviceId },
      data: { status: 'BLOCKED' },
    });
  }

  async createPairingCode(deviceId: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.devicePairing.create({
      data: {
        id: generateUuidV7(),
        deviceId,
        pairingCode: code,
        isPaired: false,
      },
    });
    return code;
  }
}
