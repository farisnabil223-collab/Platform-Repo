export abstract class DomainException extends Error {
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DomainRuleViolationException extends DomainException {
  public readonly code = 'DOMAIN_RULE_VIOLATION';
}

export class ConcurrencyException extends DomainException {
  public readonly code = 'CONCURRENCY_CONFLICT';
}
