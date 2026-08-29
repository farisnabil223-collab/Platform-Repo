import { BullRootModuleOptions } from '@nestjs/bullmq';

/**
 * Shared configuration generator for NestJS BullMQ module.
 */
export function getQueueConfig(): BullRootModuleOptions {
  return {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  };
}

export { BullModule, InjectQueue } from '@nestjs/bullmq';
export { Queue, Worker, Job } from 'bullmq';
export const QUEUE_NAMES = {
  NOTIFICATIONS: 'notifications',
  VIDEOS: 'videos',
  EMAILS: 'emails',
  ANALYTICS: 'analytics',
};
