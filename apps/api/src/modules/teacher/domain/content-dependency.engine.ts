import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class ContentDependencyEngine {
  async verifyDeletionSafe(entityType: 'MEDIA' | 'LESSON' | 'ASSESSMENT', entityId: string): Promise<void> {
    if (entityType === 'MEDIA') {
      const usageCount = await prisma.mediaUsage.count({
        where: { mediaAssetId: entityId },
      });
      if (usageCount > 0) {
        throw new BadRequestException('Cannot delete media asset: It is currently referenced in active lessons/assessments.');
      }
    }

    if (entityType === 'LESSON') {
      const dependencyCount = await prisma.questionDependency.count({
        where: { questionId: entityId },
      });
      if (dependencyCount > 0) {
        throw new BadRequestException('Cannot delete lesson: It is set as a prerequisite for other lessons.');
      }
    }
  }
}
