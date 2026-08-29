import { AggregateRoot } from './aggregate-root';

export interface DataLakeDatasetProps {
  tenantId: string;
  name: string;
  zone: string;
  format: string;
  version: number;
  configJson: any;
}

export class DataLakeDataset extends AggregateRoot<DataLakeDatasetProps> {
  constructor(id: string, props: DataLakeDatasetProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get zone(): string { return this.props.zone; }
  get format(): string { return this.props.format; }
  get datasetVersion(): number { return this.props.version; }
  get configJson(): any { return this.props.configJson; }
}

export interface ETLPipelineProps {
  tenantId: string;
  name: string;
  schedule?: string;
  status: string;
  configJson: any;
  lastRunAt?: Date;
}

export class ETLPipeline extends AggregateRoot<ETLPipelineProps> {
  constructor(id: string, props: ETLPipelineProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get schedule(): string | undefined { return this.props.schedule; }
  get status(): string { return this.props.status; }
  get configJson(): any { return this.props.configJson; }
  get lastRunAt(): Date | undefined { return this.props.lastRunAt; }
}

export interface PipelineExecutionProps {
  tenantId: string;
  pipelineId: string;
  status: string;
  records: number;
  startedAt?: Date;
  completedAt?: Date;
}

export class PipelineExecution extends AggregateRoot<PipelineExecutionProps> {
  constructor(id: string, props: PipelineExecutionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get pipelineId(): string { return this.props.pipelineId; }
  get status(): string { return this.props.status; }
  get records(): number { return this.props.records; }
  get startedAt(): Date | undefined { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
}

export interface DataLineageNodeProps {
  tenantId: string;
  name: string;
  nodeType: string;
  metaJson: any;
}

export class DataLineageNode extends AggregateRoot<DataLineageNodeProps> {
  constructor(id: string, props: DataLineageNodeProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get nodeType(): string { return this.props.nodeType; }
  get metaJson(): any { return this.props.metaJson; }
}

export interface DataLineageEdgeProps {
  tenantId: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export class DataLineageEdge extends AggregateRoot<DataLineageEdgeProps> {
  constructor(id: string, props: DataLineageEdgeProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get sourceId(): string { return this.props.sourceId; }
  get targetId(): string { return this.props.targetId; }
  get label(): string | undefined { return this.props.label; }
}

export interface DataQualityRuleProps {
  tenantId: string;
  datasetId: string;
  ruleType: string;
  configJson: any;
  score: number;
}

export class DataQualityRule extends AggregateRoot<DataQualityRuleProps> {
  constructor(id: string, props: DataQualityRuleProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get datasetId(): string { return this.props.datasetId; }
  get ruleType(): string { return this.props.ruleType; }
  get configJson(): any { return this.props.configJson; }
  get score(): number { return this.props.score; }
}

export interface DataQualityIssueProps {
  tenantId: string;
  ruleId: string;
  severity: string;
  message: string;
  reportedAt?: Date;
}

export class DataQualityIssue extends AggregateRoot<DataQualityIssueProps> {
  constructor(id: string, props: DataQualityIssueProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get ruleId(): string { return this.props.ruleId; }
  get severity(): string { return this.props.severity; }
  get message(): string { return this.props.message; }
  get reportedAt(): Date | undefined { return this.props.reportedAt; }
}

export interface CatalogEntryProps {
  tenantId: string;
  entityName: string;
  classification: string;
  ownerEmail: string;
  glossaryJson: any;
}

export class CatalogEntry extends AggregateRoot<CatalogEntryProps> {
  constructor(id: string, props: CatalogEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get entityName(): string { return this.props.entityName; }
  get classification(): string { return this.props.classification; }
  get ownerEmail(): string { return this.props.ownerEmail; }
  get glossaryJson(): any { return this.props.glossaryJson; }
}

export interface GovernancePolicyProps {
  tenantId: string;
  policyName: string;
  retentionDays: number;
  maskingRules: any;
}

export class GovernancePolicy extends AggregateRoot<GovernancePolicyProps> {
  constructor(id: string, props: GovernancePolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get policyName(): string { return this.props.policyName; }
  get retentionDays(): number { return this.props.retentionDays; }
  get maskingRules(): any { return this.props.maskingRules; }
}

export interface BiKpiDefinitionProps {
  tenantId: string;
  metricName: string;
  category: string;
  targetValue: number;
  dimensionsJson: any;
}

export class BiKpiDefinition extends AggregateRoot<BiKpiDefinitionProps> {
  constructor(id: string, props: BiKpiDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get metricName(): string { return this.props.metricName; }
  get category(): string { return this.props.category; }
  get targetValue(): number { return this.props.targetValue; }
  get dimensionsJson(): any { return this.props.dimensionsJson; }
}

export interface ExecutiveScorecardProps {
  tenantId: string;
  title: string;
  scorecardsJson: any;
}

export class ExecutiveScorecard extends AggregateRoot<ExecutiveScorecardProps> {
  constructor(id: string, props: ExecutiveScorecardProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get scorecardsJson(): any { return this.props.scorecardsJson; }
}

export interface FeatureStoreGroupProps {
  tenantId: string;
  name: string;
  entityType: string;
  featuresJson: any;
}

export class FeatureStoreGroup extends AggregateRoot<FeatureStoreGroupProps> {
  constructor(id: string, props: FeatureStoreGroupProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get entityType(): string { return this.props.entityType; }
  get featuresJson(): any { return this.props.featuresJson; }
}

export interface MlModelRegistryProps {
  tenantId: string;
  modelName: string;
  version: string;
  algorithm: string;
  accuracy: number;
  status: string;
  endpointUrl?: string;
}

export class MlModelRegistry extends AggregateRoot<MlModelRegistryProps> {
  constructor(id: string, props: MlModelRegistryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get modelName(): string { return this.props.modelName; }
  get modelVersion(): string { return this.props.version; }
  get algorithm(): string { return this.props.algorithm; }
  get accuracy(): number { return this.props.accuracy; }
  get status(): string { return this.props.status; }
  get endpointUrl(): string | undefined { return this.props.endpointUrl; }
}
