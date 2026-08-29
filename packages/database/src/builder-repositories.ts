import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
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
  AppRestorePoint
} from '@eduverse/kernel';

export class FormDefinitionRepository extends BaseTenantRepository {
  async save(form: FormDefinition): Promise<void> {
    await prisma.formDefinition.upsert({
      where: { id: form.id },
      update: { status: form.status, fieldsJson: form.fieldsJson, schemaJson: form.schemaJson },
      create: {
        id: form.id,
        tenantId: this.getTenantIdOrThrow(),
        title: form.title,
        version: form.formVersion,
        status: form.status,
        fieldsJson: form.fieldsJson,
        schemaJson: form.schemaJson,
      },
    });
  }

  async findById(id: string): Promise<FormDefinition | null> {
    const row = await prisma.formDefinition.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new FormDefinition(row.id, {
      tenantId: row.tenantId,
      title: row.title,
      version: row.version,
      status: row.status,
      fieldsJson: row.fieldsJson,
      schemaJson: row.schemaJson,
    });
  }
}

export class FormSubmissionRepository extends BaseTenantRepository {
  async save(sub: FormSubmission): Promise<void> {
    await prisma.formSubmission.create({
      data: {
        id: sub.id,
        tenantId: this.getTenantIdOrThrow(),
        formId: sub.formId,
        dataJson: sub.dataJson,
        submittedBy: sub.submittedBy,
      },
    });
  }
}

export class ApplicationPageRepository extends BaseTenantRepository {
  async save(page: ApplicationPage): Promise<void> {
    await prisma.applicationPage.upsert({
      where: { id: page.id },
      update: { layoutJson: page.layoutJson, widgetsJson: page.widgetsJson },
      create: {
        id: page.id,
        tenantId: this.getTenantIdOrThrow(),
        appId: page.appId,
        title: page.title,
        slug: page.slug,
        layoutJson: page.layoutJson,
        widgetsJson: page.widgetsJson,
      },
    });
  }
}

export class DynamicEntityRepository extends BaseTenantRepository {
  async save(entity: DynamicEntity): Promise<void> {
    await prisma.dynamicEntity.upsert({
      where: { id: entity.id },
      update: { attributesJson: entity.attributesJson, relationsJson: entity.relationsJson },
      create: {
        id: entity.id,
        tenantId: this.getTenantIdOrThrow(),
        name: entity.name,
        displayName: entity.displayName,
        attributesJson: entity.attributesJson,
        relationsJson: entity.relationsJson,
      },
    });
  }
}

export class DynamicRecordRepository extends BaseTenantRepository {
  async save(rec: DynamicRecord): Promise<void> {
    await prisma.dynamicRecord.upsert({
      where: { id: rec.id },
      update: { dataJson: rec.dataJson },
      create: {
        id: rec.id,
        tenantId: this.getTenantIdOrThrow(),
        entityId: rec.entityId,
        dataJson: rec.dataJson,
      },
    });
  }
}

export class ComponentDefinitionRepository extends BaseTenantRepository {
  async save(comp: ComponentDefinition): Promise<void> {
    await prisma.componentDefinition.upsert({
      where: { id: comp.id },
      update: { propsJson: comp.propsJson, eventsJson: comp.eventsJson, isShared: comp.isShared },
      create: {
        id: comp.id,
        tenantId: this.getTenantIdOrThrow(),
        name: comp.name,
        category: comp.category,
        propsJson: comp.propsJson,
        eventsJson: comp.eventsJson,
        isShared: comp.isShared,
      },
    });
  }
}

export class DashboardDefinitionRepository extends BaseTenantRepository {
  async save(dash: DashboardDefinition): Promise<void> {
    await prisma.dashboardDefinition.upsert({
      where: { id: dash.id },
      update: { layoutJson: dash.layoutJson, widgetsJson: dash.widgetsJson },
      create: {
        id: dash.id,
        tenantId: this.getTenantIdOrThrow(),
        title: dash.title,
        layoutJson: dash.layoutJson,
        widgetsJson: dash.widgetsJson,
      },
    });
  }
}

export class ReportDefinitionRepository extends BaseTenantRepository {
  async save(rep: ReportDefinition): Promise<void> {
    await prisma.reportDefinition.upsert({
      where: { id: rep.id },
      update: { datasetJson: rep.datasetJson, configJson: rep.configJson },
      create: {
        id: rep.id,
        tenantId: this.getTenantIdOrThrow(),
        title: rep.title,
        datasetJson: rep.datasetJson,
        configJson: rep.configJson,
      },
    });
  }
}

export class ThemeDefinitionRepository extends BaseTenantRepository {
  async save(theme: ThemeDefinition): Promise<void> {
    await prisma.themeDefinition.upsert({
      where: { id: theme.id },
      update: { colorsJson: theme.colorsJson, fontJson: theme.fontJson, isDefault: theme.isDefault },
      create: {
        id: theme.id,
        tenantId: this.getTenantIdOrThrow(),
        name: theme.name,
        colorsJson: theme.colorsJson,
        fontJson: theme.fontJson,
        isDefault: theme.isDefault,
      },
    });
  }
}

export class LowCodeAppRepository extends BaseTenantRepository {
  async save(app: LowCodeApp): Promise<void> {
    await prisma.lowCodeApp.upsert({
      where: { id: app.id },
      update: { environment: app.environment, navJson: app.navJson, configJson: app.configJson, publishedAt: app.publishedAt },
      create: {
        id: app.id,
        tenantId: this.getTenantIdOrThrow(),
        name: app.name,
        version: app.appVersion,
        environment: app.environment,
        navJson: app.navJson,
        configJson: app.configJson,
        publishedAt: app.publishedAt,
      },
    });
  }

  async findById(id: string): Promise<LowCodeApp | null> {
    const row = await prisma.lowCodeApp.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new LowCodeApp(row.id, {
      tenantId: row.tenantId,
      name: row.name,
      version: row.version,
      environment: row.environment,
      navJson: row.navJson,
      configJson: row.configJson,
      publishedAt: row.publishedAt ?? undefined,
    });
  }
}

export class AppRestorePointRepository extends BaseTenantRepository {
  async save(rp: AppRestorePoint): Promise<void> {
    await prisma.appRestorePoint.create({
      data: {
        id: rp.id,
        tenantId: this.getTenantIdOrThrow(),
        appId: rp.appId,
        version: rp.restoreVersion,
        snapshot: rp.snapshot,
      },
    });
  }
}
