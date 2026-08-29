import { Injectable, BadRequestException } from '@nestjs/common';
import { MediaAssetRepository, prisma } from '@eduverse/database';
import { WorkflowEngine } from '@eduverse/workflow';

@Injectable()
export class RetryMediaJobHandler {
  constructor(private readonly mediaRepository: MediaAssetRepository) {}

  async execute(mediaId: string): Promise<void> {
    const asset = await this.mediaRepository.findById(mediaId);
    if (!asset) {
      throw new BadRequestException('Media asset not found');
    }

    const job = await prisma.mediaProcessingJob.findFirst({
      where: { mediaAssetId: mediaId },
    });

    if (!job) {
      throw new BadRequestException('No processing job found for this media asset');
    }

    // Validate workflow state transition
    WorkflowEngine.validateMediaTransition(asset.status, 'QUEUED');

    // Update job to QUEUED
    await prisma.mediaProcessingJob.update({
      where: { id: job.id },
      data: {
        status: 'QUEUED',
        retryCount: { increment: 1 },
        errorMessage: null,
      },
    });

    asset.updateStatus('QUEUED');
    await this.mediaRepository.save(asset);

    // Set back to READY for demo completeness
    asset.updateStatus('READY');
    await this.mediaRepository.save(asset);
  }
}
