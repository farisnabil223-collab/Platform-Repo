import { AggregateRoot } from './aggregate-root';
import { DomainRuleViolationException } from './domain-exceptions';

export interface SessionProps {
  userId: string;
  tokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  isExpired: boolean;
  expiresAt: Date;
  lastActivity: Date;
}

export class Session extends AggregateRoot<SessionProps> {
  private _userId: string;
  private _tokenHash: string;
  private _userAgent: string | null;
  private _ipAddress: string | null;
  private _isExpired: boolean;
  private _expiresAt: Date;
  private _lastActivity: Date;

  constructor(
    id: string,
    props: SessionProps,
    version = 1,
    createdAt = new Date(),
    updatedAt = new Date(),
    deletedAt: Date | null = null,
    createdBy: string | null = null,
    updatedBy: string | null = null
  ) {
    super(id, props, version, createdAt, updatedAt, deletedAt, createdBy, updatedBy);
    this._userId = props.userId;
    this._tokenHash = props.tokenHash;
    this._userAgent = props.userAgent || null;
    this._ipAddress = props.ipAddress || null;
    this._isExpired = props.isExpired;
    this._expiresAt = props.expiresAt;
    this._lastActivity = props.lastActivity;
  }

  get userId(): string { return this._userId; }
  get tokenHash(): string { return this._tokenHash; }
  get userAgent(): string | null { return this._userAgent; }
  get ipAddress(): string | null { return this._ipAddress; }
  get isExpired(): boolean { return this._isExpired; }
  get expiresAt(): Date { return this._expiresAt; }
  get lastActivity(): Date { return this._lastActivity; }

  public renewActivity(idleTimeoutSeconds: number, absoluteMaxDate: Date): void {
    if (this._isExpired) {
      throw new DomainRuleViolationException('Cannot renew an expired session');
    }
    const now = new Date();
    this._lastActivity = now;

    // Set new expiry based on idle timeout, capped at absolute timeout
    const nextIdleExpiry = new Date(now.getTime() + idleTimeoutSeconds * 1000);
    this._expiresAt = nextIdleExpiry > absoluteMaxDate ? absoluteMaxDate : nextIdleExpiry;
  }

  public terminate(): void {
    this._isExpired = true;
  }
}
