import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  SecIdentityProvider,
  FederatedIdentity,
  UserSession,
  SecRefreshToken,
  DeviceRegistration,
  TrustedDevice,
  DeviceFingerprint,
  SessionAudit,
  RiskAssessment,
  AdaptiveAccessPolicy,
  ConditionalAccessPolicy,
  RoleHierarchy,
  PermissionGroup,
  AccessReview,
  SecApprovalWorkflow,
  BreakGlassAccount,
  SecretVault,
  SecretVersion,
  SecCertificate,
  CertificateAuthority,
  CertificateRotation,
  EncryptionKey,
  KeyRotationPolicy,
  SecSecurityPolicy,
  ComplianceRule,
  ComplianceEvidence,
  ThreatIndicator,
  ThreatFeed,
  ThreatDetection,
  SecSecurityAlert,
  SecSecurityIncident,
  MultiFactorAuth,
  ZeroTrustPolicy,
  PkiCert
} from '@eduverse/kernel';

export class SecIdentityProviderRepository extends BaseTenantRepository {
  async save(idp: SecIdentityProvider): Promise<void> {
    await prisma.secIdentityProvider.upsert({
      where: { id: idp.id },
      update: { configJson: idp.configJson, metadataUrl: idp.metadataUrl },
      create: {
        id: idp.id,
        tenantId: this.getTenantIdOrThrow(),
        providerName: idp.providerName,
        providerType: idp.providerType,
        metadataUrl: idp.metadataUrl,
        configJson: idp.configJson,
      },
    });
  }
}

export class FederatedIdentityRepository extends BaseTenantRepository {
  async save(fed: FederatedIdentity): Promise<void> {
    await prisma.federatedIdentity.create({
      data: {
        id: fed.id,
        tenantId: this.getTenantIdOrThrow(),
        providerId: fed.providerId,
        userId: fed.userId,
        externalSubjectId: fed.externalSubjectId,
        attributesJson: fed.attributesJson,
      },
    });
  }
}

export class UserSessionRepository extends BaseTenantRepository {
  async save(sess: UserSession): Promise<void> {
    await prisma.userSession.upsert({
      where: { id: sess.id },
      update: { revokedAt: sess.revokedAt, expiresAt: sess.expiresAt },
      create: {
        id: sess.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: sess.userId,
        sessionTokenHash: sess.sessionTokenHash,
        ipAddress: sess.ipAddress,
        userAgent: sess.userAgent,
        isBoundToDevice: sess.isBoundToDevice,
        expiresAt: sess.expiresAt,
        revokedAt: sess.revokedAt,
      },
    });
  }
}

export class SecRefreshTokenRepository extends BaseTenantRepository {
  async save(token: SecRefreshToken): Promise<void> {
    await prisma.secRefreshToken.upsert({
      where: { id: token.id },
      update: { isRotated: token.isRotated, replacedByTokenHash: token.replacedByTokenHash },
      create: {
        id: token.id,
        tenantId: this.getTenantIdOrThrow(),
        sessionId: token.sessionId,
        tokenHash: token.tokenHash,
        isRotated: token.isRotated,
        replacedByTokenHash: token.replacedByTokenHash,
        expiresAt: token.expiresAt,
      },
    });
  }
}

export class DeviceRegistrationRepository extends BaseTenantRepository {
  async save(dev: DeviceRegistration): Promise<void> {
    await prisma.deviceRegistration.upsert({
      where: { id: dev.id },
      update: { isTrusted: dev.isTrusted, osVersion: dev.osVersion },
      create: {
        id: dev.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: dev.userId,
        deviceId: dev.deviceId,
        deviceName: dev.deviceName,
        osVersion: dev.osVersion,
        isTrusted: dev.isTrusted,
      },
    });
  }
}

export class TrustedDeviceRepository extends BaseTenantRepository {
  async save(td: TrustedDevice): Promise<void> {
    await prisma.trustedDevice.upsert({
      where: { id: td.id },
      update: { trustScore: td.trustScore, lastValidatedAt: td.lastValidatedAt },
      create: {
        id: td.id,
        tenantId: this.getTenantIdOrThrow(),
        deviceId: td.deviceId,
        trustScore: td.trustScore,
        lastValidatedAt: td.lastValidatedAt,
      },
    });
  }
}

export class DeviceFingerprintRepository extends BaseTenantRepository {
  async save(fp: DeviceFingerprint): Promise<void> {
    await prisma.deviceFingerprint.create({
      data: {
        id: fp.id,
        tenantId: this.getTenantIdOrThrow(),
        deviceId: fp.deviceId,
        fingerprintHash: fp.fingerprintHash,
        hardwareAttributesJson: fp.hardwareAttributesJson,
      },
    });
  }
}

export class SessionAuditRepository extends BaseTenantRepository {
  async save(audit: SessionAudit): Promise<void> {
    await prisma.sessionAudit.create({
      data: {
        id: audit.id,
        tenantId: this.getTenantIdOrThrow(),
        sessionId: audit.sessionId,
        eventType: audit.eventType,
        ipAddress: audit.ipAddress,
        riskScore: audit.riskScore,
      },
    });
  }
}

export class RiskAssessmentRepository extends BaseTenantRepository {
  async save(risk: RiskAssessment): Promise<void> {
    await prisma.riskAssessment.create({
      data: {
        id: risk.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: risk.userId,
        ipAddress: risk.ipAddress,
        geoCountry: risk.geoCountry,
        riskLevel: risk.riskLevel,
        factorScoresJson: risk.factorScoresJson,
      },
    });
  }
}

export class AdaptiveAccessPolicyRepository extends BaseTenantRepository {
  async save(policy: AdaptiveAccessPolicy): Promise<void> {
    await prisma.adaptiveAccessPolicy.upsert({
      where: { id: policy.id },
      update: { isEnabled: policy.isEnabled, minRiskScore: policy.minRiskScore },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        name: policy.name,
        minRiskScore: policy.minRiskScore,
        requiredMfaType: policy.requiredMfaType,
        isEnabled: policy.isEnabled,
      },
    });
  }
}

export class ConditionalAccessPolicyRepository extends BaseTenantRepository {
  async save(cap: ConditionalAccessPolicy): Promise<void> {
    await prisma.conditionalAccessPolicy.upsert({
      where: { id: cap.id },
      update: { rulesJson: cap.rulesJson, action: cap.action },
      create: {
        id: cap.id,
        tenantId: this.getTenantIdOrThrow(),
        name: cap.name,
        rulesJson: cap.rulesJson,
        action: cap.action,
      },
    });
  }
}

export class RoleHierarchyRepository extends BaseTenantRepository {
  async save(rh: RoleHierarchy): Promise<void> {
    await prisma.roleHierarchy.create({
      data: {
        id: rh.id,
        tenantId: this.getTenantIdOrThrow(),
        parentRole: rh.parentRole,
        childRole: rh.childRole,
        permissionsJson: rh.permissionsJson,
      },
    });
  }
}

export class PermissionGroupRepository extends BaseTenantRepository {
  async save(pg: PermissionGroup): Promise<void> {
    await prisma.permissionGroup.upsert({
      where: { id: pg.id },
      update: { permissionsJson: pg.permissionsJson, description: pg.description },
      create: {
        id: pg.id,
        tenantId: this.getTenantIdOrThrow(),
        groupName: pg.groupName,
        description: pg.description,
        permissionsJson: pg.permissionsJson,
      },
    });
  }
}

export class AccessReviewRepository extends BaseTenantRepository {
  async save(ar: AccessReview): Promise<void> {
    await prisma.accessReview.upsert({
      where: { id: ar.id },
      update: { status: ar.status, reviewedAt: ar.reviewedAt },
      create: {
        id: ar.id,
        tenantId: this.getTenantIdOrThrow(),
        reviewerId: ar.reviewerId,
        targetUserId: ar.targetUserId,
        status: ar.status,
        reviewedAt: ar.reviewedAt,
      },
    });
  }
}

export class SecApprovalWorkflowRepository extends BaseTenantRepository {
  async save(wf: SecApprovalWorkflow): Promise<void> {
    await prisma.secApprovalWorkflow.upsert({
      where: { id: wf.id },
      update: { status: wf.status },
      create: {
        id: wf.id,
        tenantId: this.getTenantIdOrThrow(),
        requestType: wf.requestType,
        requesterEmail: wf.requesterEmail,
        approverEmail: wf.approverEmail,
        status: wf.status,
      },
    });
  }
}

export class BreakGlassAccountRepository extends BaseTenantRepository {
  async save(bg: BreakGlassAccount): Promise<void> {
    await prisma.breakGlassAccount.upsert({
      where: { id: bg.id },
      update: { isActivated: bg.isActivated, activatedAt: bg.activatedAt },
      create: {
        id: bg.id,
        tenantId: this.getTenantIdOrThrow(),
        accountName: bg.accountName,
        ownerEmail: bg.ownerEmail,
        emergencyReason: bg.emergencyReason,
        isActivated: bg.isActivated,
        activatedAt: bg.activatedAt,
      },
    });
  }
}

export class SecretVaultRepository extends BaseTenantRepository {
  async save(secret: SecretVault): Promise<void> {
    await prisma.secretVault.upsert({
      where: { id: secret.id },
      update: { encryptedValue: secret.encryptedValue, isRotated: secret.isRotated },
      create: {
        id: secret.id,
        tenantId: this.getTenantIdOrThrow(),
        secretName: secret.secretName,
        vaultType: secret.vaultType,
        encryptedValue: secret.encryptedValue,
        isRotated: secret.isRotated,
      },
    });
  }
}

export class SecretVersionRepository extends BaseTenantRepository {
  async save(ver: SecretVersion): Promise<void> {
    await prisma.secretVersion.create({
      data: {
        id: ver.id,
        tenantId: this.getTenantIdOrThrow(),
        vaultId: ver.vaultId,
        versionNumber: ver.versionNumber,
        encryptedValue: ver.encryptedValue,
      },
    });
  }
}

export class SecCertificateRepository extends BaseTenantRepository {
  async save(cert: SecCertificate): Promise<void> {
    await prisma.secCertificate.upsert({
      where: { id: cert.id },
      update: { isRevoked: cert.isRevoked },
      create: {
        id: cert.id,
        tenantId: this.getTenantIdOrThrow(),
        certName: cert.certName,
        serialNumber: cert.serialNumber,
        subject: cert.subject,
        issuer: cert.issuer,
        validFrom: cert.validFrom,
        validTo: cert.validTo,
        isRevoked: cert.isRevoked,
      },
    });
  }
}

export class CertificateAuthorityRepository extends BaseTenantRepository {
  async save(ca: CertificateAuthority): Promise<void> {
    await prisma.certificateAuthority.upsert({
      where: { id: ca.id },
      update: { activeSerialNumber: ca.activeSerialNumber },
      create: {
        id: ca.id,
        tenantId: this.getTenantIdOrThrow(),
        caName: ca.caName,
        rootCertPem: ca.rootCertPem,
        isRootCa: ca.isRootCa,
        activeSerialNumber: ca.activeSerialNumber,
      },
    });
  }
}

export class CertificateRotationRepository extends BaseTenantRepository {
  async save(rot: CertificateRotation): Promise<void> {
    await prisma.certificateRotation.create({
      data: {
        id: rot.id,
        tenantId: this.getTenantIdOrThrow(),
        certId: rot.certId,
        rotatedAt: rot.rotatedAt,
        nextRotationAt: rot.nextRotationAt,
      },
    });
  }
}

export class EncryptionKeyRepository extends BaseTenantRepository {
  async save(key: EncryptionKey): Promise<void> {
    await prisma.encryptionKey.upsert({
      where: { id: key.id },
      update: { keyVersion: key.keyVersion, isEnabled: key.isEnabled },
      create: {
        id: key.id,
        tenantId: this.getTenantIdOrThrow(),
        keyName: key.keyName,
        algorithm: key.algorithm,
        keyVersion: key.keyVersion,
        isEnabled: key.isEnabled,
      },
    });
  }
}

export class KeyRotationPolicyRepository extends BaseTenantRepository {
  async save(kr: KeyRotationPolicy): Promise<void> {
    await prisma.keyRotationPolicy.upsert({
      where: { id: kr.id },
      update: { nextRotationAt: kr.nextRotationAt },
      create: {
        id: kr.id,
        tenantId: this.getTenantIdOrThrow(),
        keyId: kr.keyId,
        rotationPeriodDays: kr.rotationPeriodDays,
        nextRotationAt: kr.nextRotationAt,
      },
    });
  }
}

export class SecSecurityPolicyRepository extends BaseTenantRepository {
  async save(sp: SecSecurityPolicy): Promise<void> {
    await prisma.secSecurityPolicy.upsert({
      where: { id: sp.id },
      update: { rulesJson: sp.rulesJson },
      create: {
        id: sp.id,
        tenantId: this.getTenantIdOrThrow(),
        policyName: sp.policyName,
        category: sp.category,
        rulesJson: sp.rulesJson,
      },
    });
  }
}

export class ComplianceRuleRepository extends BaseTenantRepository {
  async save(rule: ComplianceRule): Promise<void> {
    await prisma.complianceRule.upsert({
      where: { id: rule.id },
      update: { isCompliant: rule.isCompliant },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleCode: rule.ruleCode,
        framework: rule.framework,
        isCompliant: rule.isCompliant,
      },
    });
  }
}

export class ComplianceEvidenceRepository extends BaseTenantRepository {
  async save(ev: ComplianceEvidence): Promise<void> {
    await prisma.complianceEvidence.create({
      data: {
        id: ev.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleId: ev.ruleId,
        evidenceType: ev.evidenceType,
        storageUrl: ev.storageUrl,
        verifiedAt: ev.verifiedAt,
      },
    });
  }
}

export class ThreatIndicatorRepository extends BaseTenantRepository {
  async save(ti: ThreatIndicator): Promise<void> {
    await prisma.threatIndicator.upsert({
      where: { id: ti.id },
      update: { threatLevel: ti.threatLevel },
      create: {
        id: ti.id,
        tenantId: this.getTenantIdOrThrow(),
        iocType: ti.iocType,
        iocValue: ti.iocValue,
        threatLevel: ti.threatLevel,
      },
    });
  }
}

export class ThreatFeedRepository extends BaseTenantRepository {
  async save(feed: ThreatFeed): Promise<void> {
    await prisma.threatFeed.upsert({
      where: { id: feed.id },
      update: { lastSyncAt: feed.lastSyncAt },
      create: {
        id: feed.id,
        tenantId: this.getTenantIdOrThrow(),
        feedName: feed.feedName,
        feedUrl: feed.feedUrl,
        provider: feed.provider,
        lastSyncAt: feed.lastSyncAt,
      },
    });
  }
}

export class ThreatDetectionRepository extends BaseTenantRepository {
  async save(td: ThreatDetection): Promise<void> {
    await prisma.threatDetection.create({
      data: {
        id: td.id,
        tenantId: this.getTenantIdOrThrow(),
        indicatorId: td.indicatorId,
        matchedEventId: td.matchedEventId,
        riskScore: td.riskScore,
        actionTaken: td.actionTaken,
      },
    });
  }
}

export class SecSecurityAlertRepository extends BaseTenantRepository {
  async save(alert: SecSecurityAlert): Promise<void> {
    await prisma.secSecurityAlert.upsert({
      where: { id: alert.id },
      update: { status: alert.status },
      create: {
        id: alert.id,
        tenantId: this.getTenantIdOrThrow(),
        title: alert.title,
        severity: alert.severity,
        source: alert.source,
        status: alert.status,
      },
    });
  }
}

export class SecSecurityIncidentRepository extends BaseTenantRepository {
  async save(inc: SecSecurityIncident): Promise<void> {
    await prisma.secSecurityIncident.upsert({
      where: { id: inc.id },
      update: { status: inc.status, postMortemJson: inc.postMortemJson },
      create: {
        id: inc.id,
        tenantId: this.getTenantIdOrThrow(),
        title: inc.title,
        incidentCode: inc.incidentCode,
        severity: inc.severity,
        status: inc.status,
        postMortemJson: inc.postMortemJson,
      },
    });
  }
}

export class MultiFactorAuthRepository extends BaseTenantRepository {
  async save(mfa: MultiFactorAuth): Promise<void> {
    await prisma.multiFactorAuth.upsert({
      where: { id: mfa.id },
      update: { isPrimary: mfa.isPrimary },
      create: {
        id: mfa.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: mfa.userId,
        mfaType: mfa.mfaType,
        isPrimary: mfa.isPrimary,
      },
    });
  }
}

export class ZeroTrustPolicyRepository extends BaseTenantRepository {
  async save(zt: ZeroTrustPolicy): Promise<void> {
    await prisma.zeroTrustPolicy.upsert({
      where: { id: zt.id },
      update: { rulesJson: zt.rulesJson, enforcementMode: zt.enforcementMode },
      create: {
        id: zt.id,
        tenantId: this.getTenantIdOrThrow(),
        policyName: zt.policyName,
        enforcementMode: zt.enforcementMode,
        rulesJson: zt.rulesJson,
      },
    });
  }
}

export class PkiCertRepository extends BaseTenantRepository {
  async save(cert: PkiCert): Promise<void> {
    await prisma.pkiCert.upsert({
      where: { id: cert.id },
      update: { certPem: cert.certPem, keyPemEncrypted: cert.keyPemEncrypted },
      create: {
        id: cert.id,
        tenantId: this.getTenantIdOrThrow(),
        certId: cert.certId,
        commonName: cert.commonName,
        certPem: cert.certPem,
        keyPemEncrypted: cert.keyPemEncrypted,
      },
    });
  }
}
