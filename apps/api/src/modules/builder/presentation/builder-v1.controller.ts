import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  FormDefinitionRepository,
  FormSubmissionRepository,
  ApplicationPageRepository,
  DynamicEntityRepository,
  DynamicRecordRepository,
  ComponentDefinitionRepository,
  DashboardDefinitionRepository,
  ReportDefinitionRepository,
  ThemeDefinitionRepository,
  LowCodeAppRepository,
  AppRestorePointRepository
} from '@eduverse/database';
import {
  generateUuidV7,
  FormDefinition,
  FormSubmission,
  ApplicationPage,
  DynamicEntity,
  DynamicRecord,
  ComponentDefinition,
  DashboardDefinition,
  ReportDefinition,
  ThemeDefinition,
  LowCodeApp,
  AppRestorePoint,
  FormValidatorService,
  LowCodeRuntimeEngine,
  EntitySchemaGenerator,
  AiAppGeneratorService,
  DomainEventBus,
  FormCreated,
  FormSubmitted,
  DashboardCreated,
  ReportGenerated,
  ThemePublished,
  ComponentPublished,
  LowCodeAppCreated,
  LowCodeAppPublished,
  LowCodeAppRolledBack,
  RestorePointCreated
} from '@eduverse/kernel';

@ApiTags('Low-Code / No-Code Builder & Runtime Platform')
@Controller('builder')
export class BuilderController {
  private readonly formRepo = new FormDefinitionRepository();
  private readonly subRepo = new FormSubmissionRepository();
  private readonly pageRepo = new ApplicationPageRepository();
  private readonly entityRepo = new DynamicEntityRepository();
  private readonly recRepo = new DynamicRecordRepository();
  private readonly compRepo = new ComponentDefinitionRepository();
  private readonly dashRepo = new DashboardDefinitionRepository();
  private readonly repRepo = new ReportDefinitionRepository();
  private readonly themeRepo = new ThemeDefinitionRepository();
  private readonly appRepo = new LowCodeAppRepository();
  private readonly rpRepo = new AppRestorePointRepository();

  private readonly formValidator = new FormValidatorService();
  private readonly runtimeEngine = new LowCodeRuntimeEngine();
  private readonly entitySchemaValidator = new EntitySchemaGenerator();
  private readonly aiGenerator = new AiAppGeneratorService();

  // 1. Form Builder & Submissions
  @Post('forms')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new form definition schema' })
  async createForm(@Request() req: any, @Body() body: {
    title: string;
    version?: number;
    status?: string;
    fieldsJson: any;
    schemaJson?: any;
  }) {
    const form = new FormDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      version: body.version ?? 1,
      status: body.status ?? 'DRAFT',
      fieldsJson: body.fieldsJson,
      schemaJson: body.schemaJson ?? {},
    });
    await this.formRepo.save(form);
    await DomainEventBus.getInstance().publish(new FormCreated(form.id));
    return { success: true, formId: form.id };
  }

  @Post('forms/submit')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit form data payload with validation' })
  async submitForm(@Request() req: any, @Body() body: {
    formId: string;
    dataJson: Record<string, any>;
  }) {
    const form = await this.formRepo.findById(body.formId);
    if (!form) throw new BadRequestException('Form definition not found');

    this.formValidator.validateSubmission(form.fieldsJson, body.dataJson);

    const sub = new FormSubmission(generateUuidV7(), {
      tenantId: req.user.tenantId,
      formId: body.formId,
      dataJson: body.dataJson,
      submittedBy: req.user.id,
    });
    await this.subRepo.save(sub);
    await DomainEventBus.getInstance().publish(new FormSubmitted(sub.id, body.formId));
    return { success: true, submissionId: sub.id };
  }

  // 2. Page Builder
  @Post('pages')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create application page layout' })
  async createPage(@Request() req: any, @Body() body: {
    appId: string;
    title: string;
    slug: string;
    layoutJson: any;
    widgetsJson: any;
  }) {
    const page = new ApplicationPage(generateUuidV7(), {
      tenantId: req.user.tenantId,
      appId: body.appId,
      title: body.title,
      slug: body.slug,
      layoutJson: body.layoutJson,
      widgetsJson: body.widgetsJson,
    });
    await this.pageRepo.save(page);
    return { success: true, pageId: page.id };
  }

  // 3. Dynamic Data Models & Dynamic Records
  @Post('entities')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Define dynamic entity data models' })
  async createEntity(@Request() req: any, @Body() body: {
    name: string;
    displayName: string;
    attributesJson: any;
    relationsJson?: any;
  }) {
    this.entitySchemaValidator.validateAttributes(body.attributesJson);

    const entity = new DynamicEntity(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      displayName: body.displayName,
      attributesJson: body.attributesJson,
      relationsJson: body.relationsJson ?? [],
    });
    await this.entityRepo.save(entity);
    return { success: true, entityId: entity.id };
  }

  @Post('records')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Insert dynamic data record entry' })
  async createRecord(@Request() req: any, @Body() body: {
    entityId: string;
    dataJson: any;
  }) {
    const rec = new DynamicRecord(generateUuidV7(), {
      tenantId: req.user.tenantId,
      entityId: body.entityId,
      dataJson: body.dataJson,
    });
    await this.recRepo.save(rec);
    return { success: true, recordId: rec.id };
  }

  // 4. Component Library
  @Post('components')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register UI component definitions' })
  async createComponent(@Request() req: any, @Body() body: {
    name: string;
    category?: string;
    propsJson: any;
    eventsJson?: any;
    isShared?: boolean;
  }) {
    const comp = new ComponentDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      category: body.category ?? 'GENERAL',
      propsJson: body.propsJson,
      eventsJson: body.eventsJson ?? {},
      isShared: body.isShared ?? false,
    });
    await this.compRepo.save(comp);
    await DomainEventBus.getInstance().publish(new ComponentPublished(comp.id));
    return { success: true, componentId: comp.id };
  }

  // 5. Dashboards & Reports
  @Post('dashboards')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create dashboard layout definitions' })
  async createDashboard(@Request() req: any, @Body() body: {
    title: string;
    layoutJson: any;
    widgetsJson: any;
  }) {
    const dash = new DashboardDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      layoutJson: body.layoutJson,
      widgetsJson: body.widgetsJson,
    });
    await this.dashRepo.save(dash);
    await DomainEventBus.getInstance().publish(new DashboardCreated(dash.id));
    return { success: true, dashboardId: dash.id };
  }

  @Post('reports')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create report definition datasets' })
  async createReport(@Request() req: any, @Body() body: {
    title: string;
    datasetJson: any;
    configJson: any;
  }) {
    const rep = new ReportDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      datasetJson: body.datasetJson,
      configJson: body.configJson,
    });
    await this.repRepo.save(rep);
    await DomainEventBus.getInstance().publish(new ReportGenerated(rep.id));
    return { success: true, reportId: rep.id };
  }

  // 6. Themes & Branding
  @Post('themes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register tenant UI theme palette' })
  async createTheme(@Request() req: any, @Body() body: {
    name: string;
    colorsJson: any;
    fontJson: any;
    isDefault?: boolean;
  }) {
    const theme = new ThemeDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      colorsJson: body.colorsJson,
      fontJson: body.fontJson,
      isDefault: body.isDefault ?? false,
    });
    await this.themeRepo.save(theme);
    await DomainEventBus.getInstance().publish(new ThemePublished(theme.id));
    return { success: true, themeId: theme.id };
  }

  // 7. Low-Code App & Environment Promotion Pipeline (DRAFT -> STAGING -> QA -> PRODUCTION)
  @Post('apps')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Define new low-code application' })
  async createApp(@Request() req: any, @Body() body: {
    name: string;
    version?: number;
    navJson: any;
    configJson?: any;
  }) {
    const app = new LowCodeApp(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      version: body.version ?? 1,
      environment: 'DRAFT',
      navJson: body.navJson,
      configJson: body.configJson ?? {},
    });
    await this.appRepo.save(app);
    await DomainEventBus.getInstance().publish(new LowCodeAppCreated(app.id));
    return { success: true, appId: app.id, environment: app.environment };
  }

  @Post('apps/promote')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Promote application across environment pipelines' })
  async promoteApp(@Request() req: any, @Body() body: {
    appId: string;
    targetEnvironment: string; // STAGING, QA, PRODUCTION
  }) {
    const app = await this.appRepo.findById(body.appId);
    if (!app) throw new BadRequestException('Low-Code Application not found');

    const updatedApp = new LowCodeApp(app.id, {
      tenantId: app.tenantId,
      name: app.name,
      version: app.appVersion,
      environment: body.targetEnvironment,
      navJson: app.navJson,
      configJson: app.configJson,
      publishedAt: body.targetEnvironment === 'PRODUCTION' ? new Date() : app.publishedAt,
    });
    await this.appRepo.save(updatedApp);

    // Save Restore Point Snapshot
    const rp = new AppRestorePoint(generateUuidV7(), {
      tenantId: app.tenantId,
      appId: app.id,
      version: app.appVersion,
      snapshot: { name: app.name, navJson: app.navJson, configJson: app.configJson },
    });
    await this.rpRepo.save(rp);

    await DomainEventBus.getInstance().publish(new LowCodeAppPublished(app.id, body.targetEnvironment));
    await DomainEventBus.getInstance().publish(new RestorePointCreated(rp.id, app.id));

    return { success: true, appId: app.id, environment: updatedApp.environment, restorePointId: rp.id };
  }

  @Post('apps/rollback')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rollback application version to DRAFT status' })
  async rollbackApp(@Request() req: any, @Body() body: { appId: string; restorePointId: string }) {
    const app = await this.appRepo.findById(body.appId);
    if (!app) throw new BadRequestException('Low-Code Application not found');

    const updatedApp = new LowCodeApp(app.id, {
      tenantId: app.tenantId,
      name: app.name,
      version: app.appVersion,
      environment: 'DRAFT',
      navJson: app.navJson,
      configJson: app.configJson,
    });
    await this.appRepo.save(updatedApp);

    await DomainEventBus.getInstance().publish(new LowCodeAppRolledBack(app.id, body.restorePointId));
    return { success: true, appId: app.id, environment: 'DRAFT' };
  }

  // 8. AI Prompt-to-Application Generators
  @Post('ai/generate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate application layout from natural language prompt' })
  async generateFromPrompt(@Body() body: { prompt: string }) {
    const appBlueprint = this.aiGenerator.generateAppFromPrompt(body.prompt);
    return { success: true, appBlueprint };
  }
}
