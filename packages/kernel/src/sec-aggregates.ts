import { AggregateRoot } from './aggregate-root';

export interface SecIdentityProviderProps {
  tenantId: string;
  providerName: string;
  providerType: string;
  metadataUrl?: string;
  configJson: Record<string, any>;
}

export class SecIdentityProvider extends AggregateRoot<SecIdentityProviderProps> {
  get tenantId(): string { return this.props.tenantId; }
  get providerName(): string { return this.props.providerName; }
  get providerType(): string { return this.props.providerType; }
  get metadataUrl(): string | undefined { return this.props.metadataUrl; }
  get configJson(): Record<string, any> { return this.props.configJson; }
}

export interface FederatedIdentityProps {
  tenantId: string;
  providerId: string;
  userId: string;
  externalSubjectId: string;
  attributesJson: Record<string, any>;
}

export class FederatedIdentity extends AggregateRoot<FederatedIdentityProps> {
  get tenantId(): string { return this.props.tenantId; }
  get providerId(): string { return this.props.providerId; }
  get userId(): string { return this.props.userId; }
  get externalSubjectId(): string { return this.props.externalSubjectId; }
  get attributesJson(): Record<string, any> { return this.props.attributesJson; }
}

export interface UserSessionProps {
  tenantId: string;
  userId: string;
  sessionTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  isBoundToDevice: boolean;
  expiresAt: Date;
  revokedAt?: Date;
}

export class UserSession extends AggregateRoot<UserSessionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get sessionTokenHash(): string { return this.props.sessionTokenHash; }
  get ipAddress(): string | undefined { return this.props.ipAddress; }
  get userAgent(): string | undefined { return this.props.userAgent; }
  get isBoundToDevice(): boolean { return this.props.isBoundToDevice; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get revokedAt(): Date | undefined { return this.props.revokedAt; }
}

export interface SecRefreshTokenProps {
  tenantId: string;
  sessionId: string;
  tokenHash: string;
  isRotated: boolean;
  replacedByTokenHash?: string;
  expiresAt: Date;
}

export class SecRefreshToken extends AggregateRoot<SecRefreshTokenProps> {
  get tenantId(): string { return this.props.tenantId; }
  get sessionId(): string { return this.props.sessionId; }
  get tokenHash(): string { return this.props.tokenHash; }
  get isRotated(): boolean { return this.props.isRotated; }
  get replacedByTokenHash(): string | undefined { return this.props.replacedByTokenHash; }
  get expiresAt(): Date { return this.props.expiresAt; }
}

export interface DeviceRegistrationProps {
  tenantId: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  osVersion: string;
  isTrusted: boolean;
}

export class DeviceRegistration extends AggregateRoot<DeviceRegistrationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get deviceId(): string { return this.props.deviceId; }
  get deviceName(): string { return this.props.deviceName; }
  get osVersion(): string { return this.props.osVersion; }
  get isTrusted(): boolean { return this.props.isTrusted; }
}

export interface TrustedDeviceProps {
  tenantId: string;
  deviceId: string;
  trustScore: number;
  lastValidatedAt: Date;
}

export class TrustedDevice extends AggregateRoot<TrustedDeviceProps> {
  get tenantId(): string { return this.props.tenantId; }
  get deviceId(): string { return this.props.deviceId; }
  get trustScore(): number { return this.props.trustScore; }
  get lastValidatedAt(): Date { return this.props.lastValidatedAt; }
}

export interface DeviceFingerprintProps {
  tenantId: string;
  deviceId: string;
  fingerprintHash: string;
  hardwareAttributesJson: Record<string, any>;
}

export class DeviceFingerprint extends AggregateRoot<DeviceFingerprintProps> {
  get tenantId(): string { return this.props.tenantId; }
  get deviceId(): string { return this.props.deviceId; }
  get fingerprintHash(): string { return this.props.fingerprintHash; }
  get hardwareAttributesJson(): Record<string, any> { return this.props.hardwareAttributesJson; }
}

export interface SessionAuditProps {
  tenantId: string;
  sessionId: string;
  eventType: string;
  ipAddress?: string;
  riskScore: number;
}

export class SessionAudit extends AggregateRoot<SessionAuditProps> {
  get tenantId(): string { return this.props.tenantId; }
  get sessionId(): string { return this.props.sessionId; }
  get eventType(): string { return this.props.eventType; }
  get ipAddress(): string | undefined { return this.props.ipAddress; }
  get riskScore(): number { return this.props.riskScore; }
}

export interface RiskAssessmentProps {
  tenantId: string;
  userId: string;
  ipAddress?: string;
  geoCountry?: string;
  riskLevel: string;
  factorScoresJson: Record<string, any>;
}

export class RiskAssessment extends AggregateRoot<RiskAssessmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get ipAddress(): string | undefined { return this.props.ipAddress; }
  get geoCountry(): string | undefined { return this.props.geoCountry; }
  get riskLevel(): string { return this.props.riskLevel; }
  get factorScoresJson(): Record<string, any> { return this.props.factorScoresJson; }
}

export interface AdaptiveAccessPolicyProps {
  tenantId: string;
  name: string;
  minRiskScore: number;
  requiredMfaType: string;
  isEnabled: boolean;
}

export class AdaptiveAccessPolicy extends AggregateRoot<AdaptiveAccessPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get minRiskScore(): number { return this.props.minRiskScore; }
  get requiredMfaType(): string { return this.props.requiredMfaType; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface ConditionalAccessPolicyProps {
  tenantId: string;
  name: string;
  rulesJson: Record<string, any>;
  action: string;
}

export class ConditionalAccessPolicy extends AggregateRoot<ConditionalAccessPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get rulesJson(): Record<string, any> { return this.props.rulesJson; }
  get action(): string { return this.props.action; }
}

export interface RoleHierarchyProps {
  tenantId: string;
  parentRole: string;
  childRole: string;
  permissionsJson: Record<string, any>;
}

export class RoleHierarchy extends AggregateRoot<RoleHierarchyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get parentRole(): string { return this.props.parentRole; }
  get childRole(): string { return this.props.childRole; }
  get permissionsJson(): Record<string, any> { return this.props.permissionsJson; }
}

export interface PermissionGroupProps {
  tenantId: string;
  groupName: string;
  description?: string;
  permissionsJson: Record<string, any>;
}

export class PermissionGroup extends AggregateRoot<PermissionGroupProps> {
  get tenantId(): string { return this.props.tenantId; }
  get groupName(): string { return this.props.groupName; }
  get description(): string | undefined { return this.props.description; }
  get permissionsJson(): Record<string, any> { return this.props.permissionsJson; }
}

export interface AccessReviewProps {
  tenantId: string;
  reviewerId: string;
  targetUserId: string;
  status: string;
  reviewedAt?: Date;
}

export class AccessReview extends AggregateRoot<AccessReviewProps> {
  get tenantId(): string { return this.props.tenantId; }
  get reviewerId(): string { return this.props.reviewerId; }
  get targetUserId(): string { return this.props.targetUserId; }
  get status(): string { return this.props.status; }
  get reviewedAt(): Date | undefined { return this.props.reviewedAt; }
}

export interface SecApprovalWorkflowProps {
  tenantId: string;
  requestType: string;
  requesterEmail: string;
  approverEmail: string;
  status: string;
}

export class SecApprovalWorkflow extends AggregateRoot<SecApprovalWorkflowProps> {
  get tenantId(): string { return this.props.tenantId; }
  get requestType(): string { return this.props.requestType; }
  get requesterEmail(): string { return this.props.requesterEmail; }
  get approverEmail(): string { return this.props.approverEmail; }
  get status(): string { return this.props.status; }
}

export interface BreakGlassAccountProps {
  tenantId: string;
  accountName: string;
  ownerEmail: string;
  emergencyReason: string;
  isActivated: boolean;
  activatedAt?: Date;
}

export class BreakGlassAccount extends AggregateRoot<BreakGlassAccountProps> {
  get tenantId(): string { return this.props.tenantId; }
  get accountName(): string { return this.props.accountName; }
  get ownerEmail(): string { return this.props.ownerEmail; }
  get emergencyReason(): string { return this.props.emergencyReason; }
  get isActivated(): boolean { return this.props.isActivated; }
  get activatedAt(): Date | undefined { return this.props.activatedAt; }
}

export interface SecretVaultProps {
  tenantId: string;
  secretName: string;
  vaultType: string;
  encryptedValue: string;
  isRotated: boolean;
}

export class SecretVault extends AggregateRoot<SecretVaultProps> {
  get tenantId(): string { return this.props.tenantId; }
  get secretName(): string { return this.props.secretName; }
  get vaultType(): string { return this.props.vaultType; }
  get encryptedValue(): string { return this.props.encryptedValue; }
  get isRotated(): boolean { return this.props.isRotated; }
}

export interface SecretVersionProps {
  tenantId: string;
  vaultId: string;
  versionNumber: number;
  encryptedValue: string;
}

export class SecretVersion extends AggregateRoot<SecretVersionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get vaultId(): string { return this.props.vaultId; }
  get versionNumber(): number { return this.props.versionNumber; }
  get encryptedValue(): string { return this.props.encryptedValue; }
}

export interface SecCertificateProps {
  tenantId: string;
  certName: string;
  serialNumber: string;
  subject: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  isRevoked: boolean;
}

export class SecCertificate extends AggregateRoot<SecCertificateProps> {
  get tenantId(): string { return this.props.tenantId; }
  get certName(): string { return this.props.certName; }
  get serialNumber(): string { return this.props.serialNumber; }
  get subject(): string { return this.props.subject; }
  get issuer(): string { return this.props.issuer; }
  get validFrom(): Date { return this.props.validFrom; }
  get validTo(): Date { return this.props.validTo; }
  get isRevoked(): boolean { return this.props.isRevoked; }
}

export interface CertificateAuthorityProps {
  tenantId: string;
  caName: string;
  rootCertPem: string;
  isRootCa: boolean;
  activeSerialNumber: bigint;
}

export class CertificateAuthority extends AggregateRoot<CertificateAuthorityProps> {
  get tenantId(): string { return this.props.tenantId; }
  get caName(): string { return this.props.caName; }
  get rootCertPem(): string { return this.props.rootCertPem; }
  get isRootCa(): boolean { return this.props.isRootCa; }
  get activeSerialNumber(): bigint { return this.props.activeSerialNumber; }
}

export interface CertificateRotationProps {
  tenantId: string;
  certId: string;
  rotatedAt: Date;
  nextRotationAt: Date;
}

export class CertificateRotation extends AggregateRoot<CertificateRotationProps> {
  get tenantId(): string { return this.props.tenantId; }
  get certId(): string { return this.props.certId; }
  get rotatedAt(): Date { return this.props.rotatedAt; }
  get nextRotationAt(): Date { return this.props.nextRotationAt; }
}

export interface EncryptionKeyProps {
  tenantId: string;
  keyName: string;
  algorithm: string;
  keyVersion: number;
  isEnabled: boolean;
}

export class EncryptionKey extends AggregateRoot<EncryptionKeyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get keyName(): string { return this.props.keyName; }
  get algorithm(): string { return this.props.algorithm; }
  get keyVersion(): number { return this.props.keyVersion; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface KeyRotationPolicyProps {
  tenantId: string;
  keyId: string;
  rotationPeriodDays: number;
  nextRotationAt: Date;
}

export class KeyRotationPolicy extends AggregateRoot<KeyRotationPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get keyId(): string { return this.props.keyId; }
  get rotationPeriodDays(): number { return this.props.rotationPeriodDays; }
  get nextRotationAt(): Date { return this.props.nextRotationAt; }
}

export interface SecSecurityPolicyProps {
  tenantId: string;
  policyName: string;
  category: string;
  rulesJson: Record<string, any>;
}

export class SecSecurityPolicy extends AggregateRoot<SecSecurityPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyName(): string { return this.props.policyName; }
  get category(): string { return this.props.category; }
  get rulesJson(): Record<string, any> { return this.props.rulesJson; }
}

export interface ComplianceRuleProps {
  tenantId: string;
  ruleCode: string;
  framework: string;
  isCompliant: boolean;
}

export class ComplianceRule extends AggregateRoot<ComplianceRuleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get ruleCode(): string { return this.props.ruleCode; }
  get framework(): string { return this.props.framework; }
  get isCompliant(): boolean { return this.props.isCompliant; }
}

export interface ComplianceEvidenceProps {
  tenantId: string;
  ruleId: string;
  evidenceType: string;
  storageUrl: string;
  verifiedAt?: Date;
}

export class ComplianceEvidence extends AggregateRoot<ComplianceEvidenceProps> {
  get tenantId(): string { return this.props.tenantId; }
  get ruleId(): string { return this.props.ruleId; }
  get evidenceType(): string { return this.props.evidenceType; }
  get storageUrl(): string { return this.props.storageUrl; }
  get verifiedAt(): Date | undefined { return this.props.verifiedAt; }
}

export interface ThreatIndicatorProps {
  tenantId: string;
  iocType: string;
  iocValue: string;
  threatLevel: string;
}

export class ThreatIndicator extends AggregateRoot<ThreatIndicatorProps> {
  get tenantId(): string { return this.props.tenantId; }
  get iocType(): string { return this.props.iocType; }
  get iocValue(): string { return this.props.iocValue; }
  get threatLevel(): string { return this.props.threatLevel; }
}

export interface ThreatFeedProps {
  tenantId: string;
  feedName: string;
  feedUrl: string;
  provider: string;
  lastSyncAt?: Date;
}

export class ThreatFeed extends AggregateRoot<ThreatFeedProps> {
  get tenantId(): string { return this.props.tenantId; }
  get feedName(): string { return this.props.feedName; }
  get feedUrl(): string { return this.props.feedUrl; }
  get provider(): string { return this.props.provider; }
  get lastSyncAt(): Date | undefined { return this.props.lastSyncAt; }
}

export interface ThreatDetectionProps {
  tenantId: string;
  indicatorId: string;
  matchedEventId: string;
  riskScore: number;
  actionTaken?: string;
}

export class ThreatDetection extends AggregateRoot<ThreatDetectionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get indicatorId(): string { return this.props.indicatorId; }
  get matchedEventId(): string { return this.props.matchedEventId; }
  get riskScore(): number { return this.props.riskScore; }
  get actionTaken(): string | undefined { return this.props.actionTaken; }
}

export interface SecSecurityAlertProps {
  tenantId: string;
  title: string;
  severity: string;
  source: string;
  status: string;
}

export class SecSecurityAlert extends AggregateRoot<SecSecurityAlertProps> {
  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get severity(): string { return this.props.severity; }
  get source(): string { return this.props.source; }
  get status(): string { return this.props.status; }
}

export interface SecSecurityIncidentProps {
  tenantId: string;
  title: string;
  incidentCode: string;
  severity: string;
  status: string;
  postMortemJson?: Record<string, any>;
}

export class SecSecurityIncident extends AggregateRoot<SecSecurityIncidentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get title(): string { return this.props.title; }
  get incidentCode(): string { return this.props.incidentCode; }
  get severity(): string { return this.props.severity; }
  get status(): string { return this.props.status; }
  get postMortemJson(): Record<string, any> | undefined { return this.props.postMortemJson; }
}

export interface MultiFactorAuthProps {
  tenantId: string;
  userId: string;
  mfaType: string;
  isPrimary: boolean;
}

export class MultiFactorAuth extends AggregateRoot<MultiFactorAuthProps> {
  get tenantId(): string { return this.props.tenantId; }
  get userId(): string { return this.props.userId; }
  get mfaType(): string { return this.props.mfaType; }
  get isPrimary(): boolean { return this.props.isPrimary; }
}

export interface ZeroTrustPolicyProps {
  tenantId: string;
  policyName: string;
  enforcementMode: string;
  rulesJson: Record<string, any>;
}

export class ZeroTrustPolicy extends AggregateRoot<ZeroTrustPolicyProps> {
  get tenantId(): string { return this.props.tenantId; }
  get policyName(): string { return this.props.policyName; }
  get enforcementMode(): string { return this.props.enforcementMode; }
  get rulesJson(): Record<string, any> { return this.props.rulesJson; }
}

export interface PkiCertProps {
  tenantId: string;
  certId: string;
  commonName: string;
  certPem: string;
  keyPemEncrypted: string;
}

export class PkiCert extends AggregateRoot<PkiCertProps> {
  get tenantId(): string { return this.props.tenantId; }
  get certId(): string { return this.props.certId; }
  get commonName(): string { return this.props.commonName; }
  get certPem(): string { return this.props.certPem; }
  get keyPemEncrypted(): string { return this.props.keyPemEncrypted; }
}
