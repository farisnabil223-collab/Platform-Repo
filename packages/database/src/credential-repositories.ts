import {
  ICertificateRepository,
  ICertificateTemplateRepository,
  IIssuerOrganizationRepository,
  ICredentialWalletRepository,
  IRevocationRecordRepository,
  ICredentialShareRepository,
  Certificate,
  CertificateTemplate,
  IssuerOrganization,
  CredentialWallet,
  RevocationRecord,
  CredentialShare,
  CertificateCode,
  VerificationCode,
  CryptographicSignature,
  DidUrl,
  IssuerKey,
  AcademicTranscript
} from '@eduverse/kernel';
import { prisma } from './index';

export class IssuerOrganizationRepository implements IIssuerOrganizationRepository {
  async findById(id: string): Promise<IssuerOrganization | null> {
    const row = await prisma.issuerOrganization.findUnique({ where: { id } });
    if (!row) return null;
    return new IssuerOrganization(row.id, {
      name: row.name,
      code: row.code,
      branding: row.branding as any,
      publicKey: row.publicKey,
      policies: row.policies as any,
      didUrl: new DidUrl(row.didUrl),
    });
  }

  async findByCode(code: string): Promise<IssuerOrganization | null> {
    const row = await prisma.issuerOrganization.findUnique({ where: { code } });
    if (!row) return null;
    return new IssuerOrganization(row.id, {
      name: row.name,
      code: row.code,
      branding: row.branding as any,
      publicKey: row.publicKey,
      policies: row.policies as any,
      didUrl: new DidUrl(row.didUrl),
    });
  }

  async findAll(): Promise<IssuerOrganization[]> {
    const rows = await prisma.issuerOrganization.findMany();
    return rows.map(
      row =>
        new IssuerOrganization(row.id, {
          name: row.name,
          code: row.code,
          branding: row.branding as any,
          publicKey: row.publicKey,
          policies: row.policies as any,
          didUrl: new DidUrl(row.didUrl),
        })
    );
  }

  async save(entity: IssuerOrganization): Promise<void> {
    await prisma.issuerOrganization.upsert({
      where: { id: entity.id },
      update: {
        name: entity.name,
        code: entity.code,
        branding: entity.branding,
        publicKey: entity.publicKey,
        policies: entity.policies,
        didUrl: entity.didUrl.value,
      },
      create: {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        branding: entity.branding,
        publicKey: entity.publicKey,
        policies: entity.policies,
        didUrl: entity.didUrl.value,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.issuerOrganization.delete({ where: { id } });
  }
}

export class CertificateTemplateRepository implements ICertificateTemplateRepository {
  async findById(id: string): Promise<CertificateTemplate | null> {
    const row = await prisma.certificateTemplate.findUnique({ where: { id } });
    if (!row) return null;
    return new CertificateTemplate(row.id, {
      code: row.code,
      issuerId: row.issuerId,
      title: row.title,
      htmlLayout: row.htmlLayout,
      cssStyles: row.cssStyles || undefined,
      variables: row.variables as any,
      lifecycleState: row.lifecycleState as any,
      versionNum: row.versionNum,
      isActive: row.isActive,
    });
  }

  async findByCode(code: string): Promise<CertificateTemplate | null> {
    const row = await prisma.certificateTemplate.findUnique({ where: { code } });
    if (!row) return null;
    return new CertificateTemplate(row.id, {
      code: row.code,
      issuerId: row.issuerId,
      title: row.title,
      htmlLayout: row.htmlLayout,
      cssStyles: row.cssStyles || undefined,
      variables: row.variables as any,
      lifecycleState: row.lifecycleState as any,
      versionNum: row.versionNum,
      isActive: row.isActive,
    });
  }

  async findAll(): Promise<CertificateTemplate[]> {
    const rows = await prisma.certificateTemplate.findMany();
    return rows.map(
      row =>
        new CertificateTemplate(row.id, {
          code: row.code,
          issuerId: row.issuerId,
          title: row.title,
          htmlLayout: row.htmlLayout,
          cssStyles: row.cssStyles || undefined,
          variables: row.variables as any,
          lifecycleState: row.lifecycleState as any,
          versionNum: row.versionNum,
          isActive: row.isActive,
        })
    );
  }

  async save(entity: CertificateTemplate): Promise<void> {
    await prisma.certificateTemplate.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        htmlLayout: entity.htmlLayout,
        cssStyles: entity.cssStyles,
        variables: entity.variables,
        lifecycleState: entity.lifecycleState as any,
        versionNum: entity.versionNum,
        isActive: entity.isActive,
      },
      create: {
        id: entity.id,
        code: entity.code,
        issuerId: entity.issuerId,
        title: entity.title,
        htmlLayout: entity.htmlLayout,
        cssStyles: entity.cssStyles,
        variables: entity.variables,
        lifecycleState: entity.lifecycleState as any,
        versionNum: entity.versionNum,
        isActive: entity.isActive,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.certificateTemplate.delete({ where: { id } });
  }
}

export class CertificateRepository implements ICertificateRepository {
  private mapRow(row: any): Certificate {
    return new Certificate(row.id, {
      code: new CertificateCode(row.code),
      studentId: row.studentId,
      templateId: row.templateId,
      issuerId: row.issuerId,
      type: row.type as any,
      status: row.status as any,
      recipientName: row.recipientName,
      programName: row.programName,
      score: row.score || undefined,
      issuedAt: row.issuedAt || undefined,
      expiresAt: row.expiresAt || undefined,
      pdfPath: row.pdfPath || undefined,
      blockchainTx: row.blockchainTx || undefined,
      signature: row.signatureHash ? new CryptographicSignature(
        row.signatureHash,
        'SHA256withRSA',
        '',
        row.signatureValue || ''
      ) : undefined,
      verificationCode: new VerificationCode(row.verificationCode),
      snapshotData: row.snapshotData as any,
      qrVersion: row.qrVersion,
    }, row.version);
  }

  async findById(id: string): Promise<Certificate | null> {
    const row = await prisma.certificate.findUnique({ where: { id } });
    if (!row) return null;
    return this.mapRow(row);
  }

  async findByCode(code: string): Promise<Certificate | null> {
    const row = await prisma.certificate.findUnique({ where: { code } });
    if (!row) return null;
    return this.mapRow(row);
  }

  async findByVerificationCode(verificationCode: string): Promise<Certificate | null> {
    const row = await prisma.certificate.findUnique({ where: { verificationCode } });
    if (!row) return null;
    return this.mapRow(row);
  }

  async findAll(): Promise<Certificate[]> {
    const rows = await prisma.certificate.findMany();
    return rows.map(row => this.mapRow(row));
  }

  async save(entity: Certificate): Promise<void> {
    await prisma.certificate.upsert({
      where: { id: entity.id },
      update: {
        status: entity.status as any,
        pdfPath: entity.pdfPath,
        blockchainTx: entity.blockchainTx,
        signatureHash: entity.signature?.hash,
        signatureValue: entity.signature?.signatureValue,
        snapshotData: entity.snapshotData,
        qrVersion: entity.qrVersion,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        code: entity.code.value,
        studentId: entity.studentId,
        templateId: entity.templateId,
        issuerId: entity.issuerId,
        type: entity.type as any,
        status: entity.status as any,
        recipientName: entity.recipientName,
        programName: entity.programName,
        score: entity.score,
        issuedAt: entity.issuedAt,
        expiresAt: entity.expiresAt,
        pdfPath: entity.pdfPath,
        blockchainTx: entity.blockchainTx,
        signatureHash: entity.signature?.hash,
        signatureValue: entity.signature?.signatureValue,
        verificationCode: entity.verificationCode.value,
        snapshotData: entity.snapshotData,
        qrVersion: entity.qrVersion,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.certificate.delete({ where: { id } });
  }
}

export class CredentialWalletRepository implements ICredentialWalletRepository {
  async findById(id: string): Promise<CredentialWallet | null> {
    const row = await prisma.credentialWallet.findUnique({ where: { id } });
    if (!row) return null;
    return new CredentialWallet(row.id, {
      studentId: row.studentId,
      walletAddress: row.walletAddress || undefined,
      isPublic: row.isPublic,
    });
  }

  async findByStudentId(studentId: string): Promise<CredentialWallet | null> {
    const row = await prisma.credentialWallet.findUnique({ where: { studentId } });
    if (!row) return null;
    return new CredentialWallet(row.id, {
      studentId: row.studentId,
      walletAddress: row.walletAddress || undefined,
      isPublic: row.isPublic,
    });
  }

  async findAll(): Promise<CredentialWallet[]> {
    const rows = await prisma.credentialWallet.findMany();
    return rows.map(
      row =>
        new CredentialWallet(row.id, {
          studentId: row.studentId,
          walletAddress: row.walletAddress || undefined,
          isPublic: row.isPublic,
        })
    );
  }

  async save(entity: CredentialWallet): Promise<void> {
    await prisma.credentialWallet.upsert({
      where: { id: entity.id },
      update: {
        walletAddress: entity.walletAddress,
        isPublic: entity.isPublic,
      },
      create: {
        id: entity.id,
        studentId: entity.studentId,
        walletAddress: entity.walletAddress,
        isPublic: entity.isPublic,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.credentialWallet.delete({ where: { id } });
  }
}

export class RevocationRecordRepository implements IRevocationRecordRepository {
  async findById(id: string): Promise<RevocationRecord | null> {
    const row = await prisma.revocationRecord.findUnique({ where: { id } });
    if (!row) return null;
    return new RevocationRecord(row.id, {
      certificateId: row.certificateId,
      reason: row.reason,
      revokedBy: row.revokedBy,
      revokedAt: row.revokedAt,
      isRecovered: row.isRecovered,
      recoveredAt: row.recoveredAt || undefined,
    });
  }

  async findByCertificateId(certificateId: string): Promise<RevocationRecord | null> {
    const row = await prisma.revocationRecord.findUnique({ where: { certificateId } });
    if (!row) return null;
    return new RevocationRecord(row.id, {
      certificateId: row.certificateId,
      reason: row.reason,
      revokedBy: row.revokedBy,
      revokedAt: row.revokedAt,
      isRecovered: row.isRecovered,
      recoveredAt: row.recoveredAt || undefined,
    });
  }

  async findAll(): Promise<RevocationRecord[]> {
    const rows = await prisma.revocationRecord.findMany();
    return rows.map(
      row =>
        new RevocationRecord(row.id, {
          certificateId: row.certificateId,
          reason: row.reason,
          revokedBy: row.revokedBy,
          revokedAt: row.revokedAt,
          isRecovered: row.isRecovered,
          recoveredAt: row.recoveredAt || undefined,
        })
    );
  }

  async save(entity: RevocationRecord): Promise<void> {
    await prisma.revocationRecord.upsert({
      where: { id: entity.id },
      update: {
        reason: entity.reason,
        isRecovered: entity.isRecovered,
        recoveredAt: entity.recoveredAt,
      },
      create: {
        id: entity.id,
        certificateId: entity.certificateId,
        reason: entity.reason,
        revokedBy: entity.revokedBy,
        revokedAt: entity.revokedAt,
        isRecovered: entity.isRecovered,
        recoveredAt: entity.recoveredAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.revocationRecord.delete({ where: { id } });
  }
}

export class CredentialShareRepository implements ICredentialShareRepository {
  async findById(id: string): Promise<CredentialShare | null> {
    const row = await prisma.credentialShare.findUnique({ where: { id } });
    if (!row) return null;
    return new CredentialShare(row.id, {
      certificateId: row.certificateId,
      shareToken: row.shareToken,
      shareType: row.shareType,
      expiresAt: row.expiresAt || undefined,
      isRevoked: row.isRevoked,
    });
  }

  async findByShareToken(shareToken: string): Promise<CredentialShare | null> {
    const row = await prisma.credentialShare.findUnique({ where: { shareToken } });
    if (!row) return null;
    return new CredentialShare(row.id, {
      certificateId: row.certificateId,
      shareToken: row.shareToken,
      shareType: row.shareType,
      expiresAt: row.expiresAt || undefined,
      isRevoked: row.isRevoked,
    });
  }

  async findAll(): Promise<CredentialShare[]> {
    const rows = await prisma.credentialShare.findMany();
    return rows.map(
      row =>
        new CredentialShare(row.id, {
          certificateId: row.certificateId,
          shareToken: row.shareToken,
          shareType: row.shareType,
          expiresAt: row.expiresAt || undefined,
          isRevoked: row.isRevoked,
        })
    );
  }

  async save(entity: CredentialShare): Promise<void> {
    await prisma.credentialShare.upsert({
      where: { id: entity.id },
      update: {
        isRevoked: entity.isRevoked,
      },
      create: {
        id: entity.id,
        certificateId: entity.certificateId,
        shareToken: entity.shareToken,
        shareType: entity.shareType,
        expiresAt: entity.expiresAt,
        isRevoked: entity.isRevoked,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.credentialShare.delete({ where: { id } });
  }
}

export class IssuerKeyRepository {
  async findById(id: string): Promise<IssuerKey | null> {
    const row = await prisma.issuerKey.findUnique({ where: { id } });
    if (!row) return null;
    return new IssuerKey(row.id, {
      issuerId: row.issuerId,
      publicKey: row.publicKey,
      privateKeyEnc: row.privateKeyEnc,
      keyVersion: row.keyVersion,
      isActive: row.isActive,
      expiresAt: row.expiresAt || undefined,
      createdAt: row.createdAt,
    });
  }

  async save(entity: IssuerKey): Promise<void> {
    await prisma.issuerKey.upsert({
      where: { id: entity.id },
      update: {
        isActive: entity.isActive,
        expiresAt: entity.expiresAt,
      },
      create: {
        id: entity.id,
        issuerId: entity.issuerId,
        publicKey: entity.publicKey,
        privateKeyEnc: entity.privateKeyEnc,
        keyVersion: entity.keyVersion,
        isActive: entity.isActive,
        expiresAt: entity.expiresAt,
        createdAt: entity.createdAt,
      },
    });
  }
}

export class AcademicTranscriptRepository {
  async findById(id: string): Promise<AcademicTranscript | null> {
    const row = await prisma.academicTranscript.findUnique({ where: { id } });
    if (!row) return null;
    return new AcademicTranscript(row.id, {
      studentId: row.studentId,
      type: row.type,
      gpa: row.gpa,
      totalCredits: row.totalCredits,
      coursesJson: row.coursesJson as any,
      pdfPath: row.pdfPath || undefined,
      version: row.version,
      revision: row.revision,
      lifecycle: row.lifecycle,
    });
  }

  async save(entity: AcademicTranscript): Promise<void> {
    await prisma.academicTranscript.upsert({
      where: { id: entity.id },
      update: {
        gpa: entity.gpa,
        totalCredits: entity.totalCredits,
        coursesJson: entity.coursesJson,
        pdfPath: entity.pdfPath,
        version: entity.version,
        revision: entity.revision,
        lifecycle: entity.lifecycle,
      },
      create: {
        id: entity.id,
        studentId: entity.studentId,
        type: entity.type,
        gpa: entity.gpa,
        totalCredits: entity.totalCredits,
        coursesJson: entity.coursesJson,
        pdfPath: entity.pdfPath,
        version: entity.version,
        revision: entity.revision,
        lifecycle: entity.lifecycle,
      },
    });
  }
}
