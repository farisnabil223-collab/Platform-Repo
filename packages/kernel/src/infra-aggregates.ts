import { AggregateRoot } from './aggregate-root';

export interface DeploymentTargetProps {
  namespace: string;
  serviceName: string;
  replicas: number;
  minReplicas: number;
  maxReplicas: number;
  cpuTarget: number;
  status: string;
  region: string;
  environment: string;
}

export class DeploymentTarget extends AggregateRoot<DeploymentTargetProps> {
  constructor(id: string, props: DeploymentTargetProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get namespace(): string { return this.props.namespace; }
  get serviceName(): string { return this.props.serviceName; }
  get replicas(): number { return this.props.replicas; }
  get minReplicas(): number { return this.props.minReplicas; }
  get maxReplicas(): number { return this.props.maxReplicas; }
  get cpuTarget(): number { return this.props.cpuTarget; }
  get status(): string { return this.props.status; }
  get region(): string { return this.props.region; }
  get environment(): string { return this.props.environment; }
}

export interface ClusterHealthLogProps {
  clusterId: string;
  cpuUtilization: number;
  ramUtilization: number;
  activeNodes: number;
  status: string;
}

export class ClusterHealthLog extends AggregateRoot<ClusterHealthLogProps> {
  constructor(id: string, props: ClusterHealthLogProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get clusterId(): string { return this.props.clusterId; }
  get cpuUtilization(): number { return this.props.cpuUtilization; }
  get ramUtilization(): number { return this.props.ramUtilization; }
  get activeNodes(): number { return this.props.activeNodes; }
  get status(): string { return this.props.status; }
}

export interface CentralConfigProps {
  configKey: string;
  configValue: string;
  isSecret: boolean;
  version: number;
  lastUpdatedBy: string;
}

export class CentralConfig extends AggregateRoot<CentralConfigProps> {
  constructor(id: string, props: CentralConfigProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get configKey(): string { return this.props.configKey; }
  get configValue(): string { return this.props.configValue; }
  get isSecret(): boolean { return this.props.isSecret; }
  get configVersion(): number { return this.props.version; }
  get lastUpdatedBy(): string { return this.props.lastUpdatedBy; }
}

export interface PlatformSecretProps {
  secretName: string;
  secretValue: string;
  version: number;
  rotatedAt: Date;
  expiresAt: Date;
}

export class PlatformSecret extends AggregateRoot<PlatformSecretProps> {
  constructor(id: string, props: PlatformSecretProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get secretName(): string { return this.props.secretName; }
  get secretValue(): string { return this.props.secretValue; }
  get secretVersion(): number { return this.props.version; }
  get rotatedAt(): Date { return this.props.rotatedAt; }
  get expiresAt(): Date { return this.props.expiresAt; }
}

export interface BackupSnapshotProps {
  snapshotName: string;
  region: string;
  status: string;
  sizeGb: number;
}

export class BackupSnapshot extends AggregateRoot<BackupSnapshotProps> {
  constructor(id: string, props: BackupSnapshotProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get snapshotName(): string { return this.props.snapshotName; }
  get region(): string { return this.props.region; }
  get status(): string { return this.props.status; }
  get sizeGb(): number { return this.props.sizeGb; }
}
