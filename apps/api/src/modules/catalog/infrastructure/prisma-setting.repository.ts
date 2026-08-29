import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { ISettingRepository } from '../domain/setting.repository.interface';

@Injectable()
export class PrismaSettingRepository implements ISettingRepository {
  async get(key: string): Promise<string | null> {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    return setting ? setting.value : null;
  }

  async set(key: string, value: string, userId?: string): Promise<void> {
    await prisma.setting.upsert({
      where: { key },
      update: {
        value,
        updatedBy: userId ? userId : null,
      },
      create: {
        key,
        value,
        updatedBy: userId ? userId : null,
      },
    });
  }
}
