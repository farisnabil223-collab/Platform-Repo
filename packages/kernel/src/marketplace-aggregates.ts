import { AggregateRoot } from './aggregate-root';

export interface PartnerOrganizationProps {
  tenantId: string;
  companyName: string;
  tier: string;
  certificationDate?: Date;
}

export class PartnerOrganization extends AggregateRoot<PartnerOrganizationProps> {
  constructor(id: string, props: PartnerOrganizationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get companyName(): string { return this.props.companyName; }
  get tier(): string { return this.props.tier; }
  get certificationDate(): Date | undefined { return this.props.certificationDate; }
}

export interface MarketplaceAppProps {
  tenantId: string;
  title: string;
  description: string;
  pricingModel: string;
  category: string;
}

export class MarketplaceApp extends AggregateRoot<MarketplaceAppProps> {
  constructor(id: string, props: MarketplaceAppProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get description(): string { return this.props.description; }
  get pricingModel(): string { return this.props.pricingModel; }
  get category(): string { return this.props.category; }
}

export interface AppInstallationProps {
  tenantId: string;
  appId: string;
  installedBy: string;
  status: string;
}

export class AppInstallation extends AggregateRoot<AppInstallationProps> {
  constructor(id: string, props: AppInstallationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get appId(): string { return this.props.appId; }
  get installedBy(): string { return this.props.installedBy; }
  get status(): string { return this.props.status; }
}

export interface PublishedApiProps {
  tenantId: string;
  title: string;
  version: string;
  endpointUrl: string;
  apiPlan: string;
}

export class PublishedApi extends AggregateRoot<PublishedApiProps> {
  constructor(id: string, props: PublishedApiProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get versionString(): string { return this.props.version; }
  get endpointUrl(): string { return this.props.endpointUrl; }
  get apiPlan(): string { return this.props.apiPlan; }
}

export interface PluginRegistryEntryProps {
  tenantId: string;
  name: string;
  version: string;
  isSandboxed: boolean;
  healthStatus: string;
}

export class PluginRegistryEntry extends AggregateRoot<PluginRegistryEntryProps> {
  constructor(id: string, props: PluginRegistryEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get versionString(): string { return this.props.version; }
  get isSandboxed(): boolean { return this.props.isSandboxed; }
  get healthStatus(): string { return this.props.healthStatus; }
}

export interface IntegrationSyncJobProps {
  tenantId: string;
  connectorId: string;
  status: string;
  lastRunAt?: Date;
}

export class IntegrationSyncJob extends AggregateRoot<IntegrationSyncJobProps> {
  constructor(id: string, props: IntegrationSyncJobProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get connectorId(): string { return this.props.connectorId; }
  get status(): string { return this.props.status; }
  get lastRunAt(): Date | undefined { return this.props.lastRunAt; }
}

export interface WebhookDeliveryLogProps {
  tenantId: string;
  subscriptionId: string;
  eventType: string;
  responseStatus: number;
  isDeadLetter: boolean;
}

export class WebhookDeliveryLog extends AggregateRoot<WebhookDeliveryLogProps> {
  constructor(id: string, props: WebhookDeliveryLogProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get subscriptionId(): string { return this.props.subscriptionId; }
  get eventType(): string { return this.props.eventType; }
  get responseStatus(): number { return this.props.responseStatus; }
  get isDeadLetter(): boolean { return this.props.isDeadLetter; }
}

export interface ApiKeyProps {
  tenantId: string;
  keyHash: string;
  rateLimit: number;
}

export class ApiKey extends AggregateRoot<ApiKeyProps> {
  constructor(id: string, props: ApiKeyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get keyHash(): string { return this.props.keyHash; }
  get rateLimit(): number { return this.props.rateLimit; }
}

export interface OAuthClientProps {
  tenantId: string;
  clientName: string;
  clientSecret: string;
  scopes: string;
}

export class OAuthClient extends AggregateRoot<OAuthClientProps> {
  constructor(id: string, props: OAuthClientProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get clientName(): string { return this.props.clientName; }
  get clientSecret(): string { return this.props.clientSecret; }
  get scopes(): string { return this.props.scopes; }
}

export interface DeveloperAccountProps {
  tenantId: string;
  userId: string;
  sandboxId: string;
}

export class DeveloperAccount extends AggregateRoot<DeveloperAccountProps> {
  constructor(id: string, props: DeveloperAccountProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get sandboxId(): string { return this.props.sandboxId; }
}

export interface MarketplaceInvoiceProps {
  tenantId: string;
  payoutAmt: number;
  revShare: number;
  status: string;
}

export class MarketplaceInvoice extends AggregateRoot<MarketplaceInvoiceProps> {
  constructor(id: string, props: MarketplaceInvoiceProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get payoutAmt(): number { return this.props.payoutAmt; }
  get revShare(): number { return this.props.revShare; }
  get status(): string { return this.props.status; }
}
