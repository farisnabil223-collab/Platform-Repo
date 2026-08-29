import { IUserRepository, User } from '@eduverse/kernel';
import { PrismaBaseRepository } from './prisma-repository';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

export class UserRepository extends PrismaBaseRepository<User, PrismaUser> implements IUserRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.user);
  }

  toDomain(record: PrismaUser): User {
    return new User(
      record.id,
      {
        email: record.email,
        phone: record.phone,
        passwordHash: record.passwordHash,
        isActive: record.isActive,
        isLocked: record.isLocked,
        lockUntil: record.lockUntil,
        emailVerified: record.emailVerified,
      },
      record.version,
      record.createdAt,
      record.updatedAt,
      record.deletedAt,
      record.createdBy,
      record.updatedBy
    );
  }

  toPersistence(domain: User): PrismaUser {
    return {
      id: domain.id,
      email: domain.email,
      phone: domain.phone,
      passwordHash: domain.passwordHash,
      isActive: domain.isActive,
      isLocked: domain.isLocked,
      lockUntil: domain.lockUntil,
      emailVerified: domain.emailVerified,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
      version: domain.version,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prismaClient.user.findFirst({
      where: { email, deletedAt: null },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const record = await this.prismaClient.user.findFirst({
      where: { phone, deletedAt: null },
    });
    return record ? this.toDomain(record) : null;
  }

  async save(entity: User): Promise<void> {
    const data = this.toPersistence(entity);
    await this.prismaClient.user.upsert({
      where: { id: entity.id },
      update: {
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        isActive: data.isActive,
        isLocked: data.isLocked,
        lockUntil: data.lockUntil,
        emailVerified: data.emailVerified,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
      create: data,
    });
  }
}
