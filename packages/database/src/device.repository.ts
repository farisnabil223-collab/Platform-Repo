import { IDeviceRepository, Device } from '@eduverse/kernel';
import { PrismaBaseRepository } from './prisma-repository';
import { PrismaClient, Device as PrismaDevice } from '@prisma/client';

export class DeviceRepository extends PrismaBaseRepository<Device, PrismaDevice> implements IDeviceRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.device);
  }

  toDomain(record: PrismaDevice): Device {
    return new Device(
      record.id,
      {
        userId: record.userId,
        deviceHash: record.deviceHash,
        name: record.name,
        browser: record.browser,
        os: record.os,
        ipAddress: record.ipAddress,
        lastActivity: record.lastActivity,
        isTrusted: record.isTrusted,
      },
      record.version,
      record.createdAt,
      record.lastActivity
    );
  }

  toPersistence(domain: Device): PrismaDevice {
    return {
      id: domain.id,
      userId: domain.userId,
      deviceHash: domain.deviceHash,
      name: domain.name,
      browser: domain.browser,
      os: domain.os,
      ipAddress: domain.ipAddress,
      lastActivity: domain.lastActivity,
      isTrusted: domain.isTrusted,
      createdAt: domain.createdAt,
      version: domain.version,
    };
  }

  async findByUserIdAndHash(userId: string, deviceHash: string): Promise<Device | null> {
    const record = await this.prismaClient.device.findUnique({
      where: {
        userId_deviceHash: { userId, deviceHash },
      },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<Device[]> {
    const records = await this.prismaClient.device.findMany({
      where: { userId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async save(entity: Device): Promise<void> {
    const data = this.toPersistence(entity);
    await this.prismaClient.device.upsert({
      where: { id: entity.id },
      update: {
        lastActivity: data.lastActivity,
        ipAddress: data.ipAddress,
        isTrusted: data.isTrusted,
        version: { increment: 1 },
      },
      create: data,
    });
  }
}
