import { AggregateRoot } from './aggregate-root';

export interface ResearchProjectProps {
  tenantId: string;
  title: string;
  budget: number;
  ethicsState: string;
  status: string;
}

export class ResearchProject extends AggregateRoot<ResearchProjectProps> {
  constructor(id: string, props: ResearchProjectProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get budget(): number { return this.props.budget; }
  get ethicsState(): string { return this.props.ethicsState; }
  get status(): string { return this.props.status; }
}

export interface ExternalPartnerProps {
  tenantId: string;
  name: string;
  country: string;
}

export class ExternalPartner extends AggregateRoot<ExternalPartnerProps> {
  constructor(id: string, props: ExternalPartnerProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get country(): string { return this.props.country; }
}

export interface ResearcherProfileProps {
  tenantId: string;
  userId: string;
  orcid: string;
  institution: string;
}

export class ResearcherProfile extends AggregateRoot<ResearcherProfileProps> {
  constructor(id: string, props: ResearcherProfileProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get orcid(): string { return this.props.orcid; }
  get institution(): string { return this.props.institution; }
}

export interface ResearchPublicationProps {
  tenantId: string;
  title: string;
  doi: string;
  citationsCount: number;
  status: string;
}

export class ResearchPublication extends AggregateRoot<ResearchPublicationProps> {
  constructor(id: string, props: ResearchPublicationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get doi(): string { return this.props.doi; }
  get citationsCount(): number { return this.props.citationsCount; }
  get status(): string { return this.props.status; }
}

export interface PublicationAuthorProps {
  tenantId: string;
  publicationId: string;
  researcherId: string;
  authorOrder: number;
  isCorresponding: boolean;
}

export class PublicationAuthor extends AggregateRoot<PublicationAuthorProps> {
  constructor(id: string, props: PublicationAuthorProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get publicationId(): string { return this.props.publicationId; }
  get researcherId(): string { return this.props.researcherId; }
  get authorOrder(): number { return this.props.authorOrder; }
  get isCorresponding(): boolean { return this.props.isCorresponding; }
}

export interface GrantCallProps {
  tenantId: string;
  title: string;
  sponsorName: string;
  fundingLimit: number;
  deadline: Date;
}

export class GrantCall extends AggregateRoot<GrantCallProps> {
  constructor(id: string, props: GrantCallProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get sponsorName(): string { return this.props.sponsorName; }
  get fundingLimit(): number { return this.props.fundingLimit; }
  get deadline(): Date { return this.props.deadline; }
}

export interface GrantApplicationProps {
  tenantId: string;
  grantCallId: string;
  title: string;
  requestedAmt: number;
  status: string;
}

export class GrantApplication extends AggregateRoot<GrantApplicationProps> {
  constructor(id: string, props: GrantApplicationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get grantCallId(): string { return this.props.grantCallId; }
  get title(): string { return this.props.title; }
  get requestedAmt(): number { return this.props.requestedAmt; }
  get status(): string { return this.props.status; }
}

export interface LaboratoryProps {
  tenantId: string;
  name: string;
  location: string;
}

export class Laboratory extends AggregateRoot<LaboratoryProps> {
  constructor(id: string, props: LaboratoryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get location(): string { return this.props.location; }
}

export interface LabEquipmentProps {
  tenantId: string;
  labId: string;
  name: string;
  isCalibrated: boolean;
  status: string;
}

export class LabEquipment extends AggregateRoot<LabEquipmentProps> {
  constructor(id: string, props: LabEquipmentProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get labId(): string { return this.props.labId; }
  get name(): string { return this.props.name; }
  get isCalibrated(): boolean { return this.props.isCalibrated; }
  get status(): string { return this.props.status; }
}

export interface EquipmentReservationProps {
  tenantId: string;
  equipmentId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: string;
}

export class EquipmentReservation extends AggregateRoot<EquipmentReservationProps> {
  constructor(id: string, props: EquipmentReservationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get equipmentId(): string { return this.props.equipmentId; }
  get userId(): string { return this.props.userId; }
  get startTime(): Date { return this.props.startTime; }
  get endTime(): Date { return this.props.endTime; }
  get status(): string { return this.props.status; }
}

export interface PatentRegistryProps {
  tenantId: string;
  title: string;
  patentNumber: string;
  royaltiesEarned: number;
  status: string;
}

export class PatentRegistry extends AggregateRoot<PatentRegistryProps> {
  constructor(id: string, props: PatentRegistryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get patentNumber(): string { return this.props.patentNumber; }
  get royaltiesEarned(): number { return this.props.royaltiesEarned; }
  get status(): string { return this.props.status; }
}

export interface KnowledgeAssetProps {
  tenantId: string;
  title: string;
  assetType: string;
  fileUrl: string;
}

export class KnowledgeAsset extends AggregateRoot<KnowledgeAssetProps> {
  constructor(id: string, props: KnowledgeAssetProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get assetType(): string { return this.props.assetType; }
  get fileUrl(): string { return this.props.fileUrl; }
}
