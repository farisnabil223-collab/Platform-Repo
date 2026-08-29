import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  ResearchProject,
  ExternalPartner,
  ResearcherProfile,
  ResearchPublication,
  PublicationAuthor,
  GrantCall,
  GrantApplication,
  Laboratory,
  LabEquipment,
  EquipmentReservation,
  PatentRegistry,
  KnowledgeAsset
} from '@eduverse/kernel';

export class ResearchProjectRepository extends BaseTenantRepository {
  async save(project: ResearchProject): Promise<void> {
    await prisma.researchProject.upsert({
      where: { id: project.id },
      update: {
        budget: project.budget,
        ethicsState: project.ethicsState,
        status: project.status,
      },
      create: {
        id: project.id,
        tenantId: this.getTenantIdOrThrow(),
        title: project.title,
        budget: project.budget,
        ethicsState: project.ethicsState,
        status: project.status,
      },
    });
  }

  async findById(id: string): Promise<ResearchProject | null> {
    const row = await prisma.researchProject.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new ResearchProject(row.id, {
      tenantId: row.tenantId,
      title: row.title,
      budget: row.budget,
      ethicsState: row.ethicsState,
      status: row.status,
    });
  }
}

export class ExternalPartnerRepository extends BaseTenantRepository {
  async save(partner: ExternalPartner): Promise<void> {
    await prisma.externalPartner.upsert({
      where: { id: partner.id },
      update: { name: partner.name, country: partner.country },
      create: {
        id: partner.id,
        tenantId: this.getTenantIdOrThrow(),
        name: partner.name,
        country: partner.country,
      },
    });
  }
}

export class ResearcherProfileRepository extends BaseTenantRepository {
  async save(profile: ResearcherProfile): Promise<void> {
    await prisma.researcherProfile.upsert({
      where: { id: profile.id },
      update: { orcid: profile.orcid, institution: profile.institution },
      create: {
        id: profile.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: profile.userId,
        orcid: profile.orcid,
        institution: profile.institution,
      },
    });
  }
}

export class ResearchPublicationRepository extends BaseTenantRepository {
  async save(pub: ResearchPublication): Promise<void> {
    await prisma.researchPublication.upsert({
      where: { id: pub.id },
      update: {
        citationsCount: pub.citationsCount,
        status: pub.status,
      },
      create: {
        id: pub.id,
        tenantId: this.getTenantIdOrThrow(),
        title: pub.title,
        doi: pub.doi,
        citationsCount: pub.citationsCount,
        status: pub.status,
      },
    });
  }
}

export class PublicationAuthorRepository extends BaseTenantRepository {
  async save(author: PublicationAuthor): Promise<void> {
    await prisma.publicationAuthor.upsert({
      where: { id: author.id },
      update: { authorOrder: author.authorOrder, isCorresponding: author.isCorresponding },
      create: {
        id: author.id,
        tenantId: this.getTenantIdOrThrow(),
        publicationId: author.publicationId,
        researcherId: author.researcherId,
        authorOrder: author.authorOrder,
        isCorresponding: author.isCorresponding,
      },
    });
  }
}

export class GrantCallRepository extends BaseTenantRepository {
  async save(call: GrantCall): Promise<void> {
    await prisma.grantCall.upsert({
      where: { id: call.id },
      update: { deadline: call.deadline },
      create: {
        id: call.id,
        tenantId: this.getTenantIdOrThrow(),
        title: call.title,
        sponsorName: call.sponsorName,
        fundingLimit: call.fundingLimit,
        deadline: call.deadline,
      },
    });
  }
}

export class GrantApplicationRepository extends BaseTenantRepository {
  async save(app: GrantApplication): Promise<void> {
    await prisma.grantApplication.upsert({
      where: { id: app.id },
      update: { status: app.status },
      create: {
        id: app.id,
        tenantId: this.getTenantIdOrThrow(),
        grantCallId: app.grantCallId,
        title: app.title,
        requestedAmt: app.requestedAmt,
        status: app.status,
      },
    });
  }
}

export class LaboratoryRepository extends BaseTenantRepository {
  async save(lab: Laboratory): Promise<void> {
    await prisma.laboratory.upsert({
      where: { id: lab.id },
      update: { location: lab.location },
      create: {
        id: lab.id,
        tenantId: this.getTenantIdOrThrow(),
        name: lab.name,
        location: lab.location,
      },
    });
  }
}

export class LabEquipmentRepository extends BaseTenantRepository {
  async save(eq: LabEquipment): Promise<void> {
    await prisma.labEquipment.upsert({
      where: { id: eq.id },
      update: { isCalibrated: eq.isCalibrated, status: eq.status },
      create: {
        id: eq.id,
        tenantId: this.getTenantIdOrThrow(),
        labId: eq.labId,
        name: eq.name,
        isCalibrated: eq.isCalibrated,
        status: eq.status,
      },
    });
  }

  async findById(id: string): Promise<LabEquipment | null> {
    const row = await prisma.labEquipment.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new LabEquipment(row.id, {
      tenantId: row.tenantId,
      labId: row.labId,
      name: row.name,
      isCalibrated: row.isCalibrated,
      status: row.status,
    });
  }
}

export class EquipmentReservationRepository extends BaseTenantRepository {
  async save(res: EquipmentReservation): Promise<void> {
    await prisma.equipmentReservation.upsert({
      where: { id: res.id },
      update: { status: res.status },
      create: {
        id: res.id,
        tenantId: this.getTenantIdOrThrow(),
        equipmentId: res.equipmentId,
        userId: res.userId,
        startTime: res.startTime,
        endTime: res.endTime,
        status: res.status,
      },
    });
  }
}

export class PatentRegistryRepository extends BaseTenantRepository {
  async save(patent: PatentRegistry): Promise<void> {
    await prisma.patentRegistry.upsert({
      where: { id: patent.id },
      update: { royaltiesEarned: patent.royaltiesEarned, status: patent.status },
      create: {
        id: patent.id,
        tenantId: this.getTenantIdOrThrow(),
        title: patent.title,
        patentNumber: patent.patentNumber,
        royaltiesEarned: patent.royaltiesEarned,
        status: patent.status,
      },
    });
  }
}

export class KnowledgeAssetRepository extends BaseTenantRepository {
  async save(asset: KnowledgeAsset): Promise<void> {
    await prisma.knowledgeAsset.upsert({
      where: { id: asset.id },
      update: { title: asset.title },
      create: {
        id: asset.id,
        tenantId: this.getTenantIdOrThrow(),
        title: asset.title,
        assetType: asset.assetType,
        fileUrl: asset.fileUrl,
      },
    });
  }
}
