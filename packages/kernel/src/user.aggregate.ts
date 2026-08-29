import { AggregateRoot } from './aggregate-root';
import { DomainRuleViolationException } from './domain-exceptions';

export interface UserProps {
  email: string;
  phone?: string | null;
  passwordHash: string;
  isActive: boolean;
  isLocked: boolean;
  lockUntil?: Date | null;
  emailVerified: boolean;
}

export class User extends AggregateRoot<UserProps> {
  private _email: string;
  private _phone: string | null;
  private _passwordHash: string;
  private _isActive: boolean;
  private _isLocked: boolean;
  private _lockUntil: Date | null;
  private _emailVerified: boolean;

  constructor(
    id: string,
    props: UserProps,
    version = 1,
    createdAt = new Date(),
    updatedAt = new Date(),
    deletedAt: Date | null = null,
    createdBy: string | null = null,
    updatedBy: string | null = null
  ) {
    super(id, props, version, createdAt, updatedAt, deletedAt, createdBy, updatedBy);
    this.validateEmail(props.email);
    this._email = props.email;
    this._phone = props.phone || null;
    this._passwordHash = props.passwordHash;
    this._isActive = props.isActive;
    this._isLocked = props.isLocked;
    this._lockUntil = props.lockUntil || null;
    this._emailVerified = props.emailVerified;
  }

  get email(): string { return this._email; }
  get phone(): string | null { return this._phone; }
  get passwordHash(): string { return this._passwordHash; }
  get isActive(): boolean { return this._isActive; }
  get isLocked(): boolean { return this._isLocked; }
  get lockUntil(): Date | null { return this._lockUntil; }
  get emailVerified(): boolean { return this._emailVerified; }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new DomainRuleViolationException('Invalid email format');
    }
  }

  public changePassword(newPasswordHash: string): void {
    if (!newPasswordHash) {
      throw new DomainRuleViolationException('Password hash cannot be empty');
    }
    this._passwordHash = newPasswordHash;
  }

  public lock(until: Date): void {
    this._isLocked = true;
    this._lockUntil = until;
  }

  public unlock(): void {
    this._isLocked = false;
    this._lockUntil = null;
  }

  public markEmailVerified(): void {
    this._emailVerified = true;
  }

  public verifyEmail(): void {
    this._emailVerified = true;
  }
}
