import { AggregateRoot } from './aggregate-root';

export interface DeviceProps {
  userId: string;
  deviceHash: string; // fingerprint hash
  name?: string | null;
  browser?: string | null;
  os?: string | null;
  ipAddress?: string | null;
  lastActivity: Date;
  isTrusted: boolean;
}

export class Device extends AggregateRoot<DeviceProps> {
  private _userId: string;
  private _deviceHash: string;
  private _name: string | null;
  private _browser: string | null;
  private _os: string | null;
  private _ipAddress: string | null;
  private _lastActivity: Date;
  private _isTrusted: boolean;

  constructor(
    id: string,
    props: DeviceProps,
    version = 1,
    createdAt = new Date(),
    updatedAt = new Date(),
    deletedAt: Date | null = null,
    createdBy: string | null = null,
    updatedBy: string | null = null
  ) {
    super(id, props, version, createdAt, updatedAt, deletedAt, createdBy, updatedBy);
    this._userId = props.userId;
    this._deviceHash = props.deviceHash;
    this._name = props.name || null;
    this._browser = props.browser || null;
    this._os = props.os || null;
    this._ipAddress = props.ipAddress || null;
    this._lastActivity = props.lastActivity;
    this._isTrusted = props.isTrusted;
  }

  get userId(): string { return this._userId; }
  get deviceHash(): string { return this._deviceHash; }
  get name(): string | null { return this._name; }
  get browser(): string | null { return this._browser; }
  get os(): string | null { return this._os; }
  get ipAddress(): string | null { return this._ipAddress; }
  get lastActivity(): Date { return this._lastActivity; }
  get isTrusted(): boolean { return this._isTrusted; }

  public updateActivity(ip: string | null): void {
    this._lastActivity = new Date();
    if (ip) {
      this._ipAddress = ip;
    }
  }

  public trust(): void {
    this._isTrusted = true;
  }

  public untrust(): void {
    this._isTrusted = false;
  }
}
