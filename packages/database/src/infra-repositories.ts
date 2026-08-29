import { prisma } from './index';
import { DeploymentTarget, CentralConfig, PlatformSecret, BackupSnapshot } from '@eduverse/kernel';

export class DeploymentTargetRepository {
  async save(target: DeploymentTarget): Promise<void> {
    await prisma.deploymentTarget.upsert({
      where: { serviceName: target.serviceName },
      update: {
        namespace: target.namespace,
        replicas: target.replicas,
        minReplicas: target.minReplicas,
        maxReplicas: target.maxReplicas,
        cpuTarget: target.cpuTarget,
        status: target.status,
        region: target.region,
        environment: target.environment,
      },
      create: {
        id: target.id,
        namespace: target.namespace,
        serviceName: target.serviceName,
        replicas: target.replicas,
        minReplicas: target.minReplicas,
        maxReplicas: target.maxReplicas,
        cpuTarget: target.cpuTarget,
        status: target.status,
        region: target.region,
        environment: target.environment,
      },
    });
  }

  async findMany(): Promise<DeploymentTarget[]> {
    const list = await prisma.deploymentTarget.findMany();
    return list.map((item: any) => new DeploymentTarget(item.id, {
      namespace: item.namespace,
      serviceName: item.serviceName,
      replicas: item.replicas,
      minReplicas: item.minReplicas,
      maxReplicas: item.maxReplicas,
      cpuTarget: item.cpuTarget,
      status: item.status,
      region: item.region,
      environment: item.environment,
    }));
  }
}

export class CentralConfigRepository {
  async save(config: CentralConfig): Promise<void> {
    await prisma.centralConfig.upsert({
      where: { configKey: config.configKey },
      update: {
        configValue: config.configValue,
        isSecret: config.isSecret,
        version: config.configVersion,
        updatedBy: config.lastUpdatedBy,
      },
      create: {
        id: config.id,
        configKey: config.configKey,
        configValue: config.configValue,
        isSecret: config.isSecret,
        version: config.configVersion,
        updatedBy: config.lastUpdatedBy,
      },
    });
  }

  async findByKey(configKey: string): Promise<CentralConfig | null> {
    const row = await prisma.centralConfig.findUnique({ where: { configKey } });
    if (!row) return null;
    return new CentralConfig(row.id, {
      configKey: row.configKey,
      configValue: row.configValue,
      isSecret: row.isSecret,
      version: row.version,
      lastUpdatedBy: row.updatedBy,
    });
  }
}

export class PlatformSecretRepository {
  async save(secret: PlatformSecret): Promise<void> {
    await prisma.platformSecret.upsert({
      where: { secretName: secret.secretName },
      update: {
        secretValue: secret.secretValue,
        version: secret.secretVersion,
        rotatedAt: secret.rotatedAt,
        expiresAt: secret.expiresAt,
      },
      create: {
        id: secret.id,
        secretName: secret.secretName,
        secretValue: secret.secretValue,
        version: secret.secretVersion,
        rotatedAt: secret.rotatedAt,
        expiresAt: secret.expiresAt,
      },
    });
  }

  async findByName(secretName: string): Promise<PlatformSecret | null> {
    const row = await prisma.platformSecret.findUnique({ where: { secretName } });
    if (!row) return null;
    return new PlatformSecret(row.id, {
      secretName: row.secretName,
      secretValue: row.secretValue,
      version: row.version,
      rotatedAt: row.rotatedAt,
      expiresAt: row.expiresAt,
    });
  }
}

export class BackupSnapshotRepository {
  async save(snapshot: BackupSnapshot): Promise<void> {
    await prisma.backupSnapshot.create({
      data: {
        id: snapshot.id,
        snapshotName: snapshot.snapshotName,
        region: snapshot.region,
        status: snapshot.status,
        sizeGb: snapshot.sizeGb,
      },
    });
  }

  async findMany(): Promise<BackupSnapshot[]> {
    const list = await prisma.backupSnapshot.findMany();
    return list.map((item: any) => new BackupSnapshot(item.id, {
      snapshotName: item.snapshotName,
      region: item.region,
      status: item.status,
      sizeGb: item.sizeGb,
    }));
  }
}
