import { IUnitOfWork } from '@eduverse/kernel';
import { PrismaClient } from '@prisma/client';

export class PrismaUnitOfWork implements IUnitOfWork {
  private transactionClient: any = null;

  constructor(private readonly prisma: PrismaClient) {}

  async startTransaction(): Promise<void> {
    // Prisma transactions are initiated dynamically on $transaction call.
    // In NestJS, standard request-scoped transactions or prisma transaction clients are used.
    // Here we define the transactional boundary helpers.
  }

  async commitTransaction(): Promise<void> {
    this.transactionClient = null;
  }

  async rollbackTransaction(): Promise<void> {
    this.transactionClient = null;
  }

  async runInTransaction<T>(work: (txClient?: any) => Promise<T>): Promise<T> {
    if (this.transactionClient) {
      return work(this.transactionClient);
    }
    return this.prisma.$transaction(async (tx) => {
      this.transactionClient = tx;
      try {
        const result = await work(tx);
        return result;
      } finally {
        this.transactionClient = null;
      }
    });
  }

  getTransactionClient(): any {
    return this.transactionClient || this.prisma;
  }
}
