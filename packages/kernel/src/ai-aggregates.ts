import { AggregateRoot } from './aggregate-root';

export interface ModelRegistryProps {
  provider: string;
  modelName: string;
  version: string;
  capabilities: any;
  contextWindow: number;
  tokenLimits: number;
  inputCost: number;
  outputCost: number;
  latencyMs: number;
  availability: number;
  status: string;
}

export class ModelRegistry extends AggregateRoot<ModelRegistryProps> {
  constructor(id: string, props: ModelRegistryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get provider(): string { return this.props.provider; }
  get modelName(): string { return this.props.modelName; }
  get latencyMs(): number { return this.props.latencyMs; }
  get inputCost(): number { return this.props.inputCost; }
  get availability(): number { return this.props.availability; }
  get status(): string { return this.props.status; }
  get versionString(): string { return this.props.version; }
  get capabilities(): any { return this.props.capabilities; }
  get contextWindow(): number { return this.props.contextWindow; }
  get tokenLimits(): number { return this.props.tokenLimits; }
  get outputCost(): number { return this.props.outputCost; }
}

export interface PromptTemplateProps {
  code: string;
  category: string;
  contentTemplate: string;
  templateVersion: string;
  approved: boolean;
  tags: string;
  metadata: any;
}

export class PromptTemplate extends AggregateRoot<PromptTemplateProps> {
  constructor(id: string, props: PromptTemplateProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get code(): string { return this.props.code; }
  get category(): string { return this.props.category; }
  get contentTemplate(): string { return this.props.contentTemplate; }
  get templateVersion(): string { return this.props.templateVersion; }
  get approved(): boolean { return this.props.approved; }
  get tags(): string { return this.props.tags; }
  get metadata(): any { return this.props.metadata; }
}

export interface KnowledgeSourceProps {
  tenantId: string;
  name: string;
  category: string;
  accessPolicy: string;
}

export class KnowledgeSource extends AggregateRoot<KnowledgeSourceProps> {
  constructor(id: string, props: KnowledgeSourceProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get category(): string { return this.props.category; }
  get accessPolicy(): string { return this.props.accessPolicy; }
}
