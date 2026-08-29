export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt = new Date(),
    public updatedAt = new Date(),
    public deletedAt: Date | null = null
  ) {}

  public equals(other?: BaseEntity): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    return this.id === other.id;
  }
}

export abstract class AggregateRoot extends BaseEntity {
  private readonly _domainEvents: any[] = [];

  public get domainEvents(): any[] {
    return this._domainEvents;
  }

  public addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}
