import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class OrganizationLifecycleService {
  async transitionStatus(orgId: string, newStatus: string) {
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
    });

    const allowedTransitions: Record<string, string[]> = {
      PROVISIONING: ['PENDING_VERIFICATION', 'ACTIVE'],
      PENDING_VERIFICATION: ['ACTIVE', 'DELETED'],
      ACTIVE: ['SUSPENDED', 'ARCHIVED'],
      SUSPENDED: ['ACTIVE', 'ARCHIVED'],
      ARCHIVED: ['ACTIVE', 'DELETED'],
    };

    const currentStatus = org.status;
    const targets = allowedTransitions[currentStatus];

    if (!targets || !targets.includes(newStatus)) {
      throw new BadRequestException(`Invalid lifecycle transition from ${currentStatus} to ${newStatus}`);
    }

    return prisma.organization.update({
      where: { id: orgId },
      data: { status: newStatus },
    });
  }
}
