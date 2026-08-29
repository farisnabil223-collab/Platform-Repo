import { DomainEvent } from './domain-event';

export class UserRegisteredEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly email: string) {
    super(aggregateId);
  }
}

export class UserLoggedInEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly ipAddress: string | null) {
    super(aggregateId);
  }
}

export class SessionCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly userId: string) {
    super(aggregateId);
  }
}

export class SessionTerminatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly userId: string) {
    super(aggregateId);
  }
}

export class DeviceRegisteredEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly userId: string, public readonly fingerprint: string) {
    super(aggregateId);
  }
}

export class TokenRotatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly userId: string) {
    super(aggregateId);
  }
}

export class TokenRevokedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly userId: string) {
    super(aggregateId);
  }
}

export class OtpGeneratedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly purpose: string) {
    super(aggregateId);
  }
}

export class OtpVerifiedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly purpose: string) {
    super(aggregateId);
  }
}

export class RoleCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly roleName: string) {
    super(aggregateId);
  }
}

export class PermissionCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly permissionName: string) {
    super(aggregateId);
  }
}

export class PasswordChangedEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}
