import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

export interface ISyncStrategy {
  computeSync(deviceId: string, lastVersion: number): Promise<any[]>;
}

export interface IConflictResolver {
  resolveConflict(localVal: any, serverVal: any): any;
}

@Injectable()
export class ServerWinsResolver implements IConflictResolver {
  resolveConflict(localVal: any, serverVal: any) {
    return serverVal;
  }
}

@Injectable()
export class ClientWinsResolver implements IConflictResolver {
  resolveConflict(localVal: any, serverVal: any) {
    return localVal;
  }
}

@Injectable()
export class OfflineSyncEngine implements ISyncStrategy {
  constructor(private readonly serverWins: ServerWinsResolver) {}

  async computeSync(deviceId: string, lastVersion: number): Promise<any[]> {
    // Read entity versions modified since last version
    const changes = await prisma.entityVersion.findMany({
      where: {
        version: { gt: lastVersion },
      },
    });

    return changes;
  }

  async resolveConflict(entityType: string, entityId: string, clientVersion: number, clientData: any) {
    const serverVer = await prisma.entityVersion.findFirst({
      where: { entityType, entityId },
    });

    if (serverVer && serverVer.version > clientVersion) {
      // Conflict! Log in DB conflict registry
      await prisma.syncConflict.create({
        data: {
          id: generateUuidV7(),
          entityType,
          entityId,
          localVersion: clientVersion,
          serverVersion: serverVer.version,
          resolution: 'SERVER_WINS',
        },
      });

      return { resolved: true, data: clientData, resolution: 'SERVER_WINS' };
    }

    return { resolved: false, data: clientData };
  }
}
