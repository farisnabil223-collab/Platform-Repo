import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BackgroundJobService {
  private readonly logger = new Logger(BackgroundJobService.name);

  async enqueueJob(queueName: string, taskData: any): Promise<string> {
    const jobId = Math.random().toString(36).substring(2, 10);
    this.logger.log(`[Job Enqueued] Queue: ${queueName}, Job ID: ${jobId}, Payload: ${JSON.stringify(taskData)}`);

    // Simulate async out-of-band processing
    setTimeout(() => {
      this.logger.log(`[Job Processed] Queue: ${queueName}, Job ID: ${jobId}`);
    }, 100);

    return jobId;
  }
}
