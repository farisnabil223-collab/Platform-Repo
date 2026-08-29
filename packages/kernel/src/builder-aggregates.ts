import { AggregateRoot } from './aggregate-root';

export interface FormDefinitionProps {
  tenantId: string;
  title: string;
  version: number;
  status: string;
  fieldsJson: any;
  schemaJson: any;
}

export class FormDefinition extends AggregateRoot<FormDefinitionProps> {
  constructor(id: string, props: FormDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get formVersion(): number { return this.props.version; }
  get status(): string { return this.props.status; }
  get fieldsJson(): any { return this.props.fieldsJson; }
  get schemaJson(): any { return this.props.schemaJson; }
}

export interface FormSubmissionProps {
  tenantId: string;
  formId: string;
  dataJson: any;
  submittedBy: string;
}

export class FormSubmission extends AggregateRoot<FormSubmissionProps> {
  constructor(id: string, props: FormSubmissionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get formId(): string { return this.props.formId; }
  get dataJson(): any { return this.props.dataJson; }
  get submittedBy(): string { return this.props.submittedBy; }
}

export interface ApplicationPageProps {
  tenantId: string;
  appId: string;
  title: string;
  slug: string;
  layoutJson: any;
  widgetsJson: any;
}

export class ApplicationPage extends AggregateRoot<ApplicationPageProps> {
  constructor(id: string, props: ApplicationPageProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get appId(): string { return this.props.appId; }
  get title(): string { return this.props.title; }
  get slug(): string { return this.props.slug; }
  get layoutJson(): any { return this.props.layoutJson; }
  get widgetsJson(): any { return this.props.widgetsJson; }
}

export interface DynamicEntityProps {
  tenantId: string;
  name: string;
  displayName: string;
  attributesJson: any;
  relationsJson: any;
}

export class DynamicEntity extends AggregateRoot<DynamicEntityProps> {
  constructor(id: string, props: DynamicEntityProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get displayName(): string { return this.props.displayName; }
  get attributesJson(): any { return this.props.attributesJson; }
  get relationsJson(): any { return this.props.relationsJson; }
}

export interface DynamicRecordProps {
  tenantId: string;
  entityId: string;
  dataJson: any;
}

export class DynamicRecord extends AggregateRoot<DynamicRecordProps> {
  constructor(id: string, props: DynamicRecordProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get entityId(): string { return this.props.entityId; }
  get dataJson(): any { return this.props.dataJson; }
}

export interface ComponentDefinitionProps {
  tenantId: string;
  name: string;
  category: string;
  propsJson: any;
  eventsJson: any;
  isShared: boolean;
}

export class ComponentDefinition extends AggregateRoot<ComponentDefinitionProps> {
  constructor(id: string, props: ComponentDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get category(): string { return this.props.category; }
  get propsJson(): any { return this.props.propsJson; }
  get eventsJson(): any { return this.props.eventsJson; }
  get isShared(): boolean { return this.props.isShared; }
}

export interface DashboardDefinitionProps {
  tenantId: string;
  title: string;
  layoutJson: any;
  widgetsJson: any;
}

export class DashboardDefinition extends AggregateRoot<DashboardDefinitionProps> {
  constructor(id: string, props: DashboardDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get layoutJson(): any { return this.props.layoutJson; }
  get widgetsJson(): any { return this.props.widgetsJson; }
}

export interface ReportDefinitionProps {
  tenantId: string;
  title: string;
  datasetJson: any;
  configJson: any;
}

export class ReportDefinition extends AggregateRoot<ReportDefinitionProps> {
  constructor(id: string, props: ReportDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get datasetJson(): any { return this.props.datasetJson; }
  get configJson(): any { return this.props.configJson; }
}

export interface ThemeDefinitionProps {
  tenantId: string;
  name: string;
  colorsJson: any;
  fontJson: any;
  isDefault: boolean;
}

export class ThemeDefinition extends AggregateRoot<ThemeDefinitionProps> {
  constructor(id: string, props: ThemeDefinitionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get colorsJson(): any { return this.props.colorsJson; }
  get fontJson(): any { return this.props.fontJson; }
  get isDefault(): boolean { return this.props.isDefault; }
}

export interface LowCodeAppProps {
  tenantId: string;
  name: string;
  version: number;
  environment: string;
  navJson: any;
  configJson: any;
  publishedAt?: Date;
}

export class LowCodeApp extends AggregateRoot<LowCodeAppProps> {
  constructor(id: string, props: LowCodeAppProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get appVersion(): number { return this.props.version; }
  get environment(): string { return this.props.environment; }
  get navJson(): any { return this.props.navJson; }
  get configJson(): any { return this.props.configJson; }
  get publishedAt(): Date | undefined { return this.props.publishedAt; }
}

export interface AppRestorePointProps {
  tenantId: string;
  appId: string;
  version: number;
  snapshot: any;
}

export class AppRestorePoint extends AggregateRoot<AppRestorePointProps> {
  constructor(id: string, props: AppRestorePointProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get appId(): string { return this.props.appId; }
  get restoreVersion(): number { return this.props.version; }
  get snapshot(): any { return this.props.snapshot; }
}
