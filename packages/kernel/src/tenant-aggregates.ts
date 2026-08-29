import { AggregateRoot } from './aggregate-root';

export interface TenantProps {
  name: string;
  status: string; // DRAFT, PROVISIONING, ACTIVE, SUSPENDED, MAINTENANCE, ARCHIVED, DELETED
}

export class Tenant extends AggregateRoot<TenantProps> {
  constructor(id: string, props: TenantProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get name(): string { return this.props.name; }
  get status(): string { return this.props.status; }

  suspend(): void {
    this.props.status = 'SUSPENDED';
  }

  activate(): void {
    this.props.status = 'ACTIVE';
  }
}

export interface OrganizationProps {
  tenantId: string;
  name: string;
  type: string; // CAMPUS, FACULTY, DEPARTMENT, BUSINESS_UNIT
  parentId?: string;
}

export class Organization extends AggregateRoot<OrganizationProps> {
  constructor(id: string, props: OrganizationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get type(): string { return this.props.type; }
  get parentId(): string | undefined { return this.props.parentId; }
}

export interface TenantSubscriptionProps {
  tenantId: string;
  plan: string;
  billingCycle: string;
  autoRenewal: boolean;
  startDate: Date;
  endDate: Date;
}

export class TenantSubscription extends AggregateRoot<TenantSubscriptionProps> {
  constructor(id: string, props: TenantSubscriptionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get plan(): string { return this.props.plan; }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date { return this.props.endDate; }
}

export interface QuotaProps {
  tenantId: string;
  resourceType: string;
  allocatedLimit: number;
  currentUsage: number;
}

export class Quota extends AggregateRoot<QuotaProps> {
  constructor(id: string, props: QuotaProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get resourceType(): string { return this.props.resourceType; }
  get allocatedLimit(): number { return this.props.allocatedLimit; }
  get currentUsage(): number { return this.props.currentUsage; }

  isExceeded(): boolean {
    return this.props.currentUsage >= this.props.allocatedLimit;
  }

  incrementUsage(amount: number): void {
    this.props.currentUsage += amount;
  }
}

export interface FeaturePackProps {
  name: string;
  description?: string;
  features: string[];
}

export class FeaturePack extends AggregateRoot<FeaturePackProps> {
  constructor(id: string, props: FeaturePackProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get name(): string { return this.props.name; }
  get features(): string[] { return this.props.features; }
}

export interface LicensePoolProps {
  tenantId: string;
  totalSeats: number;
  allocatedSeats: number;
  expirationDate: Date;
}

export class LicensePool extends AggregateRoot<LicensePoolProps> {
  constructor(id: string, props: LicensePoolProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get totalSeats(): number { return this.props.totalSeats; }
  get allocatedSeats(): number { return this.props.allocatedSeats; }

  hasAvailableSeats(): boolean {
    return this.props.allocatedSeats < this.props.totalSeats;
  }

  allocateSeat(): void {
    if (!this.hasAvailableSeats()) {
      throw new Error('No available seats in the license pool');
    }
    this.props.allocatedSeats += 1;
  }
}
