export interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
