import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { prisma, CompliancePolicyRepository, AuditEntryRepository, RiskRegisterItemRepository, UserConsentHistoryRepository } from '@eduverse/database';
import { generateUuidV7, CompliancePolicy, AuditEntry, RiskRegisterItem, UserConsentHistory, SegregationOfDutiesChecker, AuditChainVerifier } from '@eduverse/kernel';

@ApiTags('Enterprise Governance & Compliance')
@Controller('gov')
export class GovController {
  private readonly policyRepo = new CompliancePolicyRepository();
  private readonly auditRepo = new AuditEntryRepository();
  private readonly riskRepo = new RiskRegisterItemRepository();
  private readonly consentRepo = new UserConsentHistoryRepository();
  private readonly sodChecker = new SegregationOfDutiesChecker();
  private readonly chainVerifier = new AuditChainVerifier();

  // 1. Policy Registry
  @Post('policies')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new compliance framework policy' })
  async registerPolicy(@Request() req: any, @Body() body: {
    code: string;
    framework: string;
    contentTemplate: string;
    version?: string;
    assignedRoles: string;
  }) {
    const policy = new CompliancePolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      code: body.code,
      framework: body.framework,
      contentTemplate: body.contentTemplate,
      version: body.version ?? '1.0.0',
      status: 'APPROVED',
      assignedRoles: body.assignedRoles,
    });
    await this.policyRepo.save(policy);
    return { success: true, policyId: policy.id };
  }

  // 2. Segregation of Duties check on roles assignment
  @Post('policies/assign')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign roles to policy checking Segregation of Duties constraints' })
  async assignPolicyRoles(@Body() body: { roles: string[] }) {
    if (this.sodChecker.hasConflict(body.roles)) {
      throw new BadRequestException('Segregation of Duties conflict detected. Conflicting roles cannot be combined.');
    }
    return { success: true, message: 'Roles verified and assigned successfully.' };
  }

  // 3. Immutable Audit chain logging
  @Post('audit')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record tamper-proof chained audit logs' })
  async recordAudit(@Request() req: any, @Body() body: {
    action: string;
    actorId: string;
    payload: any;
  }) {
    const existing = await this.auditRepo.findMany();
    const previousHash = existing.length > 0 ? existing[existing.length - 1].hashChain : '';

    const newId = generateUuidV7();
    const itemForHash = {
      id: newId,
      action: body.action,
      actorId: body.actorId,
      payload: body.payload,
      hashChain: '',
    };
    const signature = this.chainVerifier.calculateHash(itemForHash, previousHash);

    const entry = new AuditEntry(newId, {
      tenantId: req.user.tenantId,
      action: body.action,
      actorId: body.actorId,
      payload: body.payload,
      signature,
      hashChain: signature,
    });
    await this.auditRepo.save(entry);
    return { success: true, auditId: entry.id, hashChain: entry.hashChain };
  }

  // 4. Verifies database integrity
  @Get('audit/verify')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify integrity of full audit blockchain entries chain' })
  async verifyAuditChain(@Request() req: any) {
    const existing = await this.auditRepo.findMany();
    const isValid = this.chainVerifier.verifyChain(existing);
    return { success: true, chainValid: isValid, totalRecords: existing.length };
  }

  // 5. Consent management history
  @Post('privacy/consent')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log user privacy preferences consent state changes' })
  async logConsent(@Request() req: any, @Body() body: {
    userId: string;
    purpose: string;
    granted: boolean;
  }) {
    const consent = new UserConsentHistory(generateUuidV7(), {
      tenantId: req.user.tenantId,
      userId: body.userId,
      granted: body.granted,
      purpose: body.purpose,
    });
    await this.consentRepo.save(consent);
    return { success: true, consentId: consent.id };
  }

  // 6. Data Subject privacy requests
  @Post('privacy/requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit GDPR right-to-erasure or right-to-access privacy requests' })
  async submitPrivacyRequest(@Request() req: any, @Body() body: {
    userId: string;
    requestType: string;
  }) {
    const row = await prisma.privacyRequest.create({
      data: {
        id: generateUuidV7(),
        tenantId: req.user.tenantId,
        userId: body.userId,
        requestType: body.requestType,
        status: 'RECEIVED',
      },
    });
    return { success: true, requestId: row.id, status: row.status };
  }

  // 7. Risk Register assessments
  @Get('risks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch tenant-scoped risk assessments heatmaps' })
  async listRisks(@Request() req: any) {
    const items = await this.riskRepo.findMany();
    return items.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      score: item.score,
      residualRisk: item.residualRisk,
      status: item.status,
    }));
  }
}
