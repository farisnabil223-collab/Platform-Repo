import { AggregateRoot } from './aggregate-root';

export interface AnalyticsSnapshotProps {
  snapshotType: string;
  aggregationLevel: string;
  generatedBy: string;
  generatedAt: Date;
  sourceVersion: string;
  snapshotJson: any;
  snapshotVersion: number;
  schemaVersion: string;
  checksum: string;
  compressionType: string;
}

export class AnalyticsSnapshot extends AggregateRoot<AnalyticsSnapshotProps> {
  constructor(id: string, props: AnalyticsSnapshotProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get snapshotType(): string { return this.props.snapshotType; }
  get aggregationLevel(): string { return this.props.aggregationLevel; }
  get snapshotJson(): any { return this.props.snapshotJson; }
  get checksum(): string { return this.props.checksum; }
}

export interface DashboardWidgetProps {
  id: string;
  title: string;
  visualizationType: string;
  dataset: string;
  filters?: any;
  refreshInterval: number;
  position: number;
  width: number;
  height: number;
  colorScheme: string;
  drillDownConfig?: any;
}

export interface DashboardProps {
  name: string;
  roleAllowed: string;
  theme: string;
  visibility: string;
  ownerId: string;
  tenantId: string;
  isDefault: boolean;
  version: number;
  publishedVersion: number;
  draftVersion: number;
  lastPublishedAt?: Date;
  widgets: DashboardWidgetProps[];
}

export class Dashboard extends AggregateRoot<DashboardProps> {
  constructor(id: string, props: DashboardProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get name(): string { return this.props.name; }
  get roleAllowed(): string { return this.props.roleAllowed; }
  get theme(): string { return this.props.theme; }
  get visibility(): string { return this.props.visibility; }
  get ownerId(): string { return this.props.ownerId; }
  get tenantId(): string { return this.props.tenantId; }
  get isDefault(): boolean { return this.props.isDefault; }
  get widgets(): DashboardWidgetProps[] { return this.props.widgets; }
}

export interface KPIProps {
  code: string;
  name: string;
  formulaExpression: string;
  dependencies: string;
  refreshStrategy: string;
  calculationEngine: string;
  targetValue: number;
  currentValue: number;
  aggregationWindow: string;
  targetDirection: string;
  thresholds: any;
  unit: string;
  category: string;
}

export class KPI extends AggregateRoot<KPIProps> {
  constructor(id: string, props: KPIProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get formulaExpression(): string { return this.props.formulaExpression; }
  get currentValue(): number { return this.props.currentValue; }
  get dependencies(): string { return this.props.dependencies; }
  get refreshStrategy(): string { return this.props.refreshStrategy; }
  get calculationEngine(): string { return this.props.calculationEngine; }
  get targetValue(): number { return this.props.targetValue; }
  get aggregationWindow(): string { return this.props.aggregationWindow; }
  get targetDirection(): string { return this.props.targetDirection; }
  get thresholds(): any { return this.props.thresholds; }
  get unit(): string { return this.props.unit; }
  get category(): string { return this.props.category; }
}

export interface ReportProps {
  title: string;
  type: string;
  parameters: any;
  filters: any;
  sorting: any;
  grouping: any;
  outputType: string;
  scheduleId?: string;
  executionHistory: any;
  reportTemplate: string;
  templateVersion: string;
  executionDuration: number;
  executionStatus: string;
  generatedFile?: string;
}

export class Report extends AggregateRoot<ReportProps> {
  constructor(id: string, props: ReportProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get title(): string { return this.props.title; }
  get type(): string { return this.props.type; }
  get executionStatus(): string { return this.props.executionStatus; }
}
