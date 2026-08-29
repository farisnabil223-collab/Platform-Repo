export interface IQueueProvider {
  addJob<T = any>(queueName: string, jobName: string, data: T, delayMs?: number): Promise<void>;
  registerWorker(queueName: string, processor: (data: any) => Promise<void>): void;
}
