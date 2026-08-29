import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  ResearchProjectRepository,
  ResearchPublicationRepository,
  GrantCallRepository,
  GrantApplicationRepository,
  LabEquipmentRepository,
  EquipmentReservationRepository,
  PatentRegistryRepository,
  KnowledgeAssetRepository
} from '@eduverse/database';
import {
  generateUuidV7,
  ResearchProject,
  ResearchPublication,
  GrantCall,
  GrantApplication,
  LabEquipment,
  EquipmentReservation,
  PatentRegistry,
  KnowledgeAsset,
  EquipmentSafetyGuard,
  ProjectProposalWorkflow,
  DomainEventBus,
  ResearchProposed,
  ResearchActivated,
  PublicationSubmitted,
  GrantApplicationSubmitted,
  EquipmentReserved,
  PatentRegistered,
  KnowledgeAssetUploaded
} from '@eduverse/kernel';

@ApiTags('Research & Knowledge Platform')
@Controller('research')
export class ResearchController {
  private readonly projectRepo = new ResearchProjectRepository();
  private readonly pubRepo = new ResearchPublicationRepository();
  private readonly grantCallRepo = new GrantCallRepository();
  private readonly grantAppRepo = new GrantApplicationRepository();
  private readonly equipmentRepo = new LabEquipmentRepository();
  private readonly reservationRepo = new EquipmentReservationRepository();
  private readonly patentRepo = new PatentRegistryRepository();
  private readonly assetRepo = new KnowledgeAssetRepository();

  private readonly safetyGuard = new EquipmentSafetyGuard();
  private readonly proposalWorkflow = new ProjectProposalWorkflow();

  // 1. Projects Lifecycle
  @Post('projects')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register proposed research project' })
  async proposeProject(@Request() req: any, @Body() body: {
    title: string;
    budget: number;
    ethicsState?: string;
  }) {
    const project = new ResearchProject(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      budget: body.budget,
      ethicsState: body.ethicsState ?? 'PENDING',
      status: 'PROPOSED',
    });
    await this.projectRepo.save(project);
    await DomainEventBus.getInstance().publish(new ResearchProposed(project.id));
    return { success: true, projectId: project.id, status: project.status };
  }

  // Activate project confirming ethics review approval
  @Post('projects/activate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate project verifying ethics approval status constraints' })
  async activateProject(@Request() req: any, @Body() body: { projectId: string }) {
    const project = await this.projectRepo.findById(body.projectId);
    if (!project) {
      throw new BadRequestException('Research project not found');
    }

    const nextStatus = this.proposalWorkflow.transitionToActive({
      id: project.id,
      ethicsState: project.ethicsState,
      status: project.status,
    });

    const updated = new ResearchProject(project.id, {
      tenantId: project.tenantId,
      title: project.title,
      budget: project.budget,
      ethicsState: project.ethicsState,
      status: nextStatus,
    });
    await this.projectRepo.save(updated);
    await DomainEventBus.getInstance().publish(new ResearchActivated(updated.id));
    return { success: true, projectId: updated.id, status: updated.status };
  }

  // 2. Publication DOI index
  @Post('publications')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Index new research publication with DOI tracking' })
  async submitPublication(@Request() req: any, @Body() body: {
    title: string;
    doi: string;
  }) {
    const pub = new ResearchPublication(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      doi: body.doi,
      citationsCount: 0,
      status: 'SUBMITTED',
    });
    await this.pubRepo.save(pub);
    await DomainEventBus.getInstance().publish(new PublicationSubmitted(pub.id));
    return { success: true, publicationId: pub.id };
  }

  // 3. Grant Platform Workflows
  @Post('grants/calls')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register funding grant call opportunity' })
  async createGrantCall(@Request() req: any, @Body() body: {
    title: string;
    sponsorName: string;
    fundingLimit: number;
    deadline: string;
  }) {
    const call = new GrantCall(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      sponsorName: body.sponsorName,
      fundingLimit: body.fundingLimit,
      deadline: new Date(body.deadline),
    });
    await this.grantCallRepo.save(call);
    return { success: true, grantCallId: call.id };
  }

  @Post('grants/applications')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit proposal application for grant funding' })
  async submitGrantApp(@Request() req: any, @Body() body: {
    grantCallId: string;
    title: string;
    requestedAmt: number;
  }) {
    const app = new GrantApplication(generateUuidV7(), {
      tenantId: req.user.tenantId,
      grantCallId: body.grantCallId,
      title: body.title,
      requestedAmt: body.requestedAmt,
      status: 'SUBMITTED',
    });
    await this.grantAppRepo.save(app);
    await DomainEventBus.getInstance().publish(new GrantApplicationSubmitted(app.id));
    return { success: true, applicationId: app.id };
  }

  // 4. Laboratories scheduler
  @Post('laboratories/reservations')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reserve laboratory equipment validating safety calibration' })
  async reserveEquipment(@Request() req: any, @Body() body: {
    equipmentId: string;
    startTime: string;
    endTime: string;
  }) {
    const equipment = await this.equipmentRepo.findById(body.equipmentId);
    if (!equipment) {
      throw new BadRequestException('Target equipment not found');
    }

    // Safety guard validation
    this.safetyGuard.validateSafety({
      id: equipment.id,
      isCalibrated: equipment.isCalibrated,
      status: equipment.status,
    });

    const reservation = new EquipmentReservation(generateUuidV7(), {
      tenantId: req.user.tenantId,
      equipmentId: body.equipmentId,
      userId: req.user.id,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      status: 'PENDING',
    });
    await this.reservationRepo.save(reservation);
    await DomainEventBus.getInstance().publish(new EquipmentReserved(reservation.id));
    return { success: true, reservationId: reservation.id };
  }

  // 5. Intellectual Property
  @Post('ip/patents')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register patents and IP royalty tracking variables' })
  async registerPatent(@Request() req: any, @Body() body: {
    title: string;
    patentNumber: string;
  }) {
    const patent = new PatentRegistry(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      patentNumber: body.patentNumber,
      royaltiesEarned: 0.0,
      status: 'PENDING',
    });
    await this.patentRepo.save(patent);
    await DomainEventBus.getInstance().publish(new PatentRegistered(patent.id));
    return { success: true, patentId: patent.id };
  }

  // 6. Knowledge Repositories
  @Post('knowledge/assets')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload research assets file dataset or papers notes' })
  async uploadAsset(@Request() req: any, @Body() body: {
    title: string;
    assetType: string;
    fileUrl: string;
  }) {
    const asset = new KnowledgeAsset(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      assetType: body.assetType,
      fileUrl: body.fileUrl,
    });
    await this.assetRepo.save(asset);
    await DomainEventBus.getInstance().publish(new KnowledgeAssetUploaded(asset.id));
    return { success: true, assetId: asset.id };
  }
}
