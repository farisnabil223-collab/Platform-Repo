import { Dashboard, KPI } from '@eduverse/kernel';
import { prisma } from './index';

export class DashboardRepository {
  async findById(id: string): Promise<Dashboard | null> {
    const row = await prisma.dashboard.findUnique({ where: { id }, include: { widgets: true } });
    if (!row) return null;
    return new Dashboard(row.id, {
      name: row.name,
      roleAllowed: row.roleAllowed,
      theme: row.theme,
      visibility: row.visibility,
      ownerId: row.ownerId,
      tenantId: row.tenantId,
      isDefault: row.isDefault,
      version: row.version,
      publishedVersion: row.publishedVersion,
      draftVersion: row.draftVersion,
      lastPublishedAt: row.lastPublishedAt || undefined,
      widgets: row.widgets.map(w => ({
        id: w.id,
        title: w.title,
        visualizationType: w.visualizationType,
        dataset: w.dataset,
        filters: w.filters,
        refreshInterval: w.refreshInterval,
        position: w.position,
        width: w.width,
        height: w.height,
        colorScheme: w.colorScheme,
        drillDownConfig: w.drillDownConfig,
      })),
    }, row.version, row.createdAt, row.createdAt);
  }

  async save(entity: Dashboard): Promise<void> {
    await prisma.dashboard.upsert({
      where: { id: entity.id },
      update: {
        name: entity.name,
        theme: entity.theme,
        visibility: entity.visibility,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        name: entity.name,
        roleAllowed: entity.roleAllowed,
        theme: entity.theme,
        visibility: entity.visibility,
        ownerId: entity.ownerId,
        tenantId: entity.tenantId,
        isDefault: entity.isDefault,
      },
    });

    for (const w of entity.widgets) {
      await prisma.dashboardWidget.upsert({
        where: { id: w.id },
        update: {
          title: w.title,
          position: w.position,
        },
        create: {
          id: w.id,
          dashboardId: entity.id,
          title: w.title,
          visualizationType: w.visualizationType,
          dataset: w.dataset,
          filters: w.filters,
          refreshInterval: w.refreshInterval,
          position: w.position,
          width: w.width,
          height: w.height,
          colorScheme: w.colorScheme,
          drillDownConfig: w.drillDownConfig,
        },
      });
    }
  }
}

export class KPIRepository {
  async save(entity: KPI): Promise<void> {
    await prisma.kPI.upsert({
      where: { id: entity.id },
      update: {
        currentValue: entity.currentValue,
      },
      create: {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        formulaExpression: entity.formulaExpression,
        dependencies: entity.dependencies,
        refreshStrategy: entity.refreshStrategy,
        calculationEngine: entity.calculationEngine,
        targetValue: entity.targetValue,
        currentValue: entity.currentValue,
        aggregationWindow: entity.aggregationWindow,
        targetDirection: entity.targetDirection,
        thresholds: entity.thresholds,
        unit: entity.unit,
        category: entity.category,
      },
    });
  }
}
