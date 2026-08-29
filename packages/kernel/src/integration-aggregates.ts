import { AggregateRoot } from './aggregate-root';

export interface IntegrationConnectorProps {
  tenantId: string;
  name: string;
  version: string;
  configJson: any;
  status: string;
  healthStatus: string;
  connectorType?: string;
}

export class IntegrationConnector extends AggregateRoot<IntegrationConnectorProps> {
  constructor(id: string, props: IntegrationConnectorProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get versionString(): string { return this.props.version; }
  get configJson(): any { return this.props.configJson; }
  get status(): string { return this.props.status; }
  get healthStatus(): string { return this.props.healthStatus; }
  get connectorType(): string { return this.props.connectorType ?? 'REST'; }
}

export interface WebhookSubscriptionProps {
  tenantId: string;
  targetUrl: string;
  secret: string;
  events: string;
  status: string;
}

export class WebhookSubscription extends AggregateRoot<WebhookSubscriptionProps> {
  constructor(id: string, props: WebhookSubscriptionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get targetUrl(): string { return this.props.targetUrl; }
  get secret(): string { return this.props.secret; }
  get events(): string { return this.props.events; }
  get status(): string { return this.props.status; }
}

export interface IntegrationWorkflowProps {
  tenantId: string;
  name: string;
  triggerType: string;
  configJson: any;
  status: string;
}

export class IntegrationWorkflow extends AggregateRoot<IntegrationWorkflowProps> {
  constructor(id: string, props: IntegrationWorkflowProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get triggerType(): string { return this.props.triggerType; }
  get configJson(): any { return this.props.configJson; }
  get status(): string { return this.props.status; }
}

export interface SchemaRegistryProps {
  topicName: string;
  schemaJson: any;
  registryVersion: number;
  compatibility: string;
}

export class SchemaRegistry extends AggregateRoot<SchemaRegistryProps> {
  constructor(id: string, props: SchemaRegistryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get topicName(): string { return this.props.topicName; }
  get schemaJson(): any { return this.props.schemaJson; }
  get registryVersion(): number { return this.props.registryVersion; }
  get compatibility(): string { return this.props.compatibility; }
}
