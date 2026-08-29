import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class MobileGatewayService {
  async validateDeviceAndContract(deviceId: string, contractVersion: string) {
    // 1. Check if contract is deprecated
    const contract = await prisma.apiContractVersion.findUnique({
      where: { version: contractVersion },
    });

    if (contract && contract.deprecated) {
      throw new BadRequestException('API Contract Version is deprecated. Please upgrade client application.');
    }

    // 2. Check device trust score
    const trust = await prisma.deviceTrust.findUnique({
      where: { deviceId },
    });

    if (trust && (trust.isRooted || trust.isJailbroken)) {
      throw new ForbiddenException('Device violates security compliance policies.');
    }

    return true;
  }

  async resolveMobileFeatureFlags(orgId: string): Promise<Record<string, boolean>> {
    const flags = await prisma.mobileFeatureFlag.findMany({
      where: { organizationId: orgId },
    });

    const res: Record<string, boolean> = {};
    for (const f of flags) {
      res[f.featureKey] = f.enabled;
    }
    return res;
  }
}
