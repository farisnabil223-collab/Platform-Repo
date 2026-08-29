import { AggregateRoot } from './aggregate-root';
import { BaseEntity } from './base-entity';
import {
  CertificateCode,
  VerificationCode,
  CryptographicSignature,
  DidUrl
} from './credential-value-objects';

export interface IssuerOrganizationProps {
  name: string;
  code: string;
  branding: Record<string, any>;
  publicKey: string;
  policies: Record<string, any>;
  didUrl: DidUrl;
}

export class IssuerOrganization extends AggregateRoot<IssuerOrganizationProps> {
  constructor(id: string, props: IssuerOrganizationProps, version = 1) {
    super(id, props, version);
  }

  get name() { return this.props.name; }
  get code() { return this.props.code; }
  get branding() { return this.props.branding; }
  get publicKey() { return this.props.publicKey; }
  get policies() { return this.props.policies; }
  get didUrl() { return this.props.didUrl; }
}

export interface IssuerKeyProps {
  issuerId: string;
  publicKey: string;
  privateKeyEnc: string;
  keyVersion: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export class IssuerKey extends BaseEntity<IssuerKeyProps> {
  constructor(id: string, props: IssuerKeyProps) {
    super(id, props);
  }

  get issuerId() { return this.props.issuerId; }
  get publicKey() { return this.props.publicKey; }
  get privateKeyEnc() { return this.props.privateKeyEnc; }
  get keyVersion() { return this.props.keyVersion; }
  get isActive() { return this.props.isActive; }
  get expiresAt() { return this.props.expiresAt; }
}

export interface CertificateTemplateProps {
  code: string;
  issuerId: string;
  title: string;
  htmlLayout: string;
  cssStyles?: string;
  variables: Record<string, any>;
  lifecycleState: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  versionNum: number;
  isActive: boolean;
}

export class CertificateTemplate extends BaseEntity<CertificateTemplateProps> {
  constructor(id: string, props: CertificateTemplateProps) {
    super(id, props);
  }

  get code() { return this.props.code; }
  get issuerId() { return this.props.issuerId; }
  get title() { return this.props.title; }
  get htmlLayout() { return this.props.htmlLayout; }
  get cssStyles() { return this.props.cssStyles; }
  get variables() { return this.props.variables; }
  get lifecycleState() { return this.props.lifecycleState; }
  get versionNum() { return this.props.versionNum; }
  get isActive() { return this.props.isActive; }
}

export interface CertificateProps {
  code: CertificateCode;
  studentId: string;
  templateId: string;
  issuerId: string;
  type: 'CERTIFICATE' | 'DIPLOMA' | 'MICRO_CREDENTIAL' | 'BADGE';
  status: 'DRAFT' | 'APPROVED' | 'GENERATED' | 'SIGNED' | 'ISSUED' | 'DELIVERED' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  recipientName: string;
  programName: string;
  score?: number;
  issuedAt?: Date;
  expiresAt?: Date;
  pdfPath?: string;
  blockchainTx?: string;
  signature?: CryptographicSignature;
  verificationCode: VerificationCode;
  snapshotData?: Record<string, any>;
  qrVersion: string;
}

export class Certificate extends AggregateRoot<CertificateProps> {
  constructor(id: string, props: CertificateProps, version = 1) {
    super(id, props, version);
  }

  get code() { return this.props.code; }
  get studentId() { return this.props.studentId; }
  get templateId() { return this.props.templateId; }
  get issuerId() { return this.props.issuerId; }
  get type() { return this.props.type; }
  get status() { return this.props.status; }
  get recipientName() { return this.props.recipientName; }
  get programName() { return this.props.programName; }
  get score() { return this.props.score; }
  get issuedAt() { return this.props.issuedAt; }
  get expiresAt() { return this.props.expiresAt; }
  get pdfPath() { return this.props.pdfPath; }
  get blockchainTx() { return this.props.blockchainTx; }
  get signature() { return this.props.signature; }
  get verificationCode() { return this.props.verificationCode; }
  get snapshotData() { return this.props.snapshotData; }
  get qrVersion() { return this.props.qrVersion; }

  updateStatus(status: 'DRAFT' | 'APPROVED' | 'GENERATED' | 'SIGNED' | 'ISSUED' | 'DELIVERED' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED') {
    this.props.status = status;
  }
}

export interface RevocationRecordProps {
  certificateId: string;
  reason: string;
  revokedBy: string;
  revokedAt: Date;
  isRecovered: boolean;
  recoveredAt?: Date;
}

export class RevocationRecord extends BaseEntity<RevocationRecordProps> {
  constructor(id: string, props: RevocationRecordProps) {
    super(id, props);
  }

  get certificateId() { return this.props.certificateId; }
  get reason() { return this.props.reason; }
  get revokedBy() { return this.props.revokedBy; }
  get revokedAt() { return this.props.revokedAt; }
  get isRecovered() { return this.props.isRecovered; }
  get recoveredAt() { return this.props.recoveredAt; }
}

export interface CredentialShareProps {
  certificateId: string;
  shareToken: string;
  shareType: string;
  expiresAt?: Date;
  isRevoked: boolean;
}

export class CredentialShare extends BaseEntity<CredentialShareProps> {
  constructor(id: string, props: CredentialShareProps) {
    super(id, props);
  }

  get certificateId() { return this.props.certificateId; }
  get shareToken() { return this.props.shareToken; }
  get shareType() { return this.props.shareType; }
  get expiresAt() { return this.props.expiresAt; }
  get isRevoked() { return this.props.isRevoked; }
}

export interface CredentialWalletProps {
  studentId: string;
  walletAddress?: string;
  isPublic: boolean;
}

export class CredentialWallet extends AggregateRoot<CredentialWalletProps> {
  constructor(id: string, props: CredentialWalletProps, version = 1) {
    super(id, props, version);
  }

  get studentId() { return this.props.studentId; }
  get walletAddress() { return this.props.walletAddress; }
  get isPublic() { return this.props.isPublic; }
}

export interface AcademicTranscriptProps {
  studentId: string;
  type: string;
  gpa: number;
  totalCredits: number;
  coursesJson: Record<string, any>;
  pdfPath?: string;
  version: number;
  revision: number;
  lifecycle: string;
}

export class AcademicTranscript extends AggregateRoot<AcademicTranscriptProps> {
  constructor(id: string, props: AcademicTranscriptProps, version = 1) {
    super(id, props, version);
  }

  get studentId() { return this.props.studentId; }
  get type() { return this.props.type; }
  get gpa() { return this.props.gpa; }
  get totalCredits() { return this.props.totalCredits; }
  get coursesJson() { return this.props.coursesJson; }
  get pdfPath() { return this.props.pdfPath; }
  get revision() { return this.props.revision; }
  get lifecycle() { return this.props.lifecycle; }
}
