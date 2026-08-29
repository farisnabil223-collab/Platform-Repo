import { IBaseRepository } from '@eduverse/kernel';
import { PrismaClient } from '@prisma/client';

export abstract class PrismaBaseRepository<T, PrismaModel> implements IBaseRepository<T> {
  constructor(
    protected readonly prismaClient: PrismaClient,
    protected readonly modelDelegate: any
  ) {}

  abstract toDomain(record: PrismaModel): T;
  abstract toPersistence(domain: T): PrismaModel;

  async findById(id: string): Promise<T | null> {
    const record = await this.modelDelegate.findFirst({
      where: { id, deletedAt: null },
    });
    return record ? this.toDomain(record) : null;
  }

  async findAll(): Promise<T[]> {
    const records = await this.modelDelegate.findMany({
      where: { deletedAt: null },
    });
    return records.map((record: any) => this.toDomain(record));
  }

  async delete(id: string): Promise<void> {
    await this.modelDelegate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  abstract save(entity: T): Promise<void>;
}
