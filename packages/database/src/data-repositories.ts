import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  DataLakeDataset,
  ETLPipeline,
  PipelineExecution,
  DataLineageNode,
  DataLineageEdge,
  DataQualityRule,
  DataQualityIssue,
  CatalogEntry,
  GovernancePolicy,
  BiKpiDefinition,
  ExecutiveScorecard,
  FeatureStoreGroup,
  MlModelRegistry
} from '@eduverse/kernel';

export class DataLakeDatasetRepository extends BaseTenantRepository {
  async save(ds: DataLakeDataset): Promise<void> {
    await prisma.dataLakeDataset.upsert({
      where: { id: ds.id },
      update: { zone: ds.zone, format: ds.format, version: ds.datasetVersion, configJson: ds.configJson },
      create: {
        id: ds.id,
        tenantId: this.getTenantIdOrThrow(),
        name: ds.name,
        zone: ds.zone,
        format: ds.format,
        version: ds.datasetVersion,
        configJson: ds.configJson,
      },
    });
  }

  async findById(id: string): Promise<DataLakeDataset | null> {
    const row = await prisma.dataLakeDataset.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new DataLakeDataset(row.id, {
      tenantId: row.tenantId,
      name: row.name,
      zone: row.zone,
      format: row.format,
      version: row.version,
      configJson: row.configJson,
    });
  }
}

export class ETLPipelineRepository extends BaseTenantRepository {
  async save(pipe: ETLPipeline): Promise<void> {
    await prisma.eTLPipeline.upsert({
      where: { id: pipe.id },
      update: { status: pipe.status, lastRunAt: pipe.lastRunAt },
      create: {
        id: pipe.id,
        tenantId: this.getTenantIdOrThrow(),
        name: pipe.name,
        schedule: pipe.schedule,
        status: pipe.status,
        configJson: pipe.configJson,
        lastRunAt: pipe.lastRunAt,
      },
    });
  }

  async findById(id: string): Promise<ETLPipeline | null> {
    const row = await prisma.eTLPipeline.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new ETLPipeline(row.id, {
      tenantId: row.tenantId,
      name: row.name,
      schedule: row.schedule ?? undefined,
      status: row.status,
      configJson: row.configJson,
      lastRunAt: row.lastRunAt ?? undefined,
    });
  }
}

export class PipelineExecutionRepository extends BaseTenantRepository {
  async save(exec: PipelineExecution): Promise<void> {
    await prisma.pipelineExecution.upsert({
      where: { id: exec.id },
      update: { status: exec.status, records: exec.records, completedAt: exec.completedAt },
      create: {
        id: exec.id,
        tenantId: this.getTenantIdOrThrow(),
        pipelineId: exec.pipelineId,
        status: exec.status,
        records: exec.records,
        startedAt: exec.startedAt,
        completedAt: exec.completedAt,
      },
    });
  }
}

export class DataLineageNodeRepository extends BaseTenantRepository {
  async save(node: DataLineageNode): Promise<void> {
    await prisma.dataLineageNode.upsert({
      where: { id: node.id },
      update: { metaJson: node.metaJson },
      create: {
        id: node.id,
        tenantId: this.getTenantIdOrThrow(),
        name: node.name,
        nodeType: node.nodeType,
        metaJson: node.metaJson,
      },
    });
  }
}

export class DataLineageEdgeRepository extends BaseTenantRepository {
  async save(edge: DataLineageEdge): Promise<void> {
    await prisma.dataLineageEdge.create({
      data: {
        id: edge.id,
        tenantId: this.getTenantIdOrThrow(),
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        label: edge.label,
      },
    });
  }
}

export class DataQualityRuleRepository extends BaseTenantRepository {
  async save(rule: DataQualityRule): Promise<void> {
    await prisma.dataQualityRule.upsert({
      where: { id: rule.id },
      update: { score: rule.score },
      create: {
        id: rule.id,
        tenantId: this.getTenantIdOrThrow(),
        datasetId: rule.datasetId,
        ruleType: rule.ruleType,
        configJson: rule.configJson,
        score: rule.score,
      },
    });
  }
}

export class DataQualityIssueRepository extends BaseTenantRepository {
  async save(issue: DataQualityIssue): Promise<void> {
    await prisma.dataQualityIssue.create({
      data: {
        id: issue.id,
        tenantId: this.getTenantIdOrThrow(),
        ruleId: issue.ruleId,
        severity: issue.severity,
        message: issue.message,
      },
    });
  }
}

export class CatalogEntryRepository extends BaseTenantRepository {
  async save(cat: CatalogEntry): Promise<void> {
    await prisma.catalogEntry.upsert({
      where: { id: cat.id },
      update: { classification: cat.classification, glossaryJson: cat.glossaryJson },
      create: {
        id: cat.id,
        tenantId: this.getTenantIdOrThrow(),
        entityName: cat.entityName,
        classification: cat.classification,
        ownerEmail: cat.ownerEmail,
        glossaryJson: cat.glossaryJson,
      },
    });
  }
}

export class GovernancePolicyRepository extends BaseTenantRepository {
  async save(pol: GovernancePolicy): Promise<void> {
    await prisma.governancePolicy.upsert({
      where: { id: pol.id },
      update: { retentionDays: pol.retentionDays, maskingRules: pol.maskingRules },
      create: {
        id: pol.id,
        tenantId: this.getTenantIdOrThrow(),
        policyName: pol.policyName,
        retentionDays: pol.retentionDays,
        maskingRules: pol.maskingRules,
      },
    });
  }
}

export class BiKpiDefinitionRepository extends BaseTenantRepository {
  async save(kpi: BiKpiDefinition): Promise<void> {
    await prisma.biKpiDefinition.upsert({
      where: { id: kpi.id },
      update: { targetValue: kpi.targetValue, dimensionsJson: kpi.dimensionsJson },
      create: {
        id: kpi.id,
        tenantId: this.getTenantIdOrThrow(),
        metricName: kpi.metricName,
        category: kpi.category,
        targetValue: kpi.targetValue,
        dimensionsJson: kpi.dimensionsJson,
      },
    });
  }
}

export class ExecutiveScorecardRepository extends BaseTenantRepository {
  async save(card: ExecutiveScorecard): Promise<void> {
    await prisma.executiveScorecard.upsert({
      where: { id: card.id },
      update: { scorecardsJson: card.scorecardsJson },
      create: {
        id: card.id,
        tenantId: this.getTenantIdOrThrow(),
        title: card.title,
        scorecardsJson: card.scorecardsJson,
      },
    });
  }
}

export class FeatureStoreGroupRepository extends BaseTenantRepository {
  async save(grp: FeatureStoreGroup): Promise<void> {
    await prisma.featureStoreGroup.upsert({
      where: { id: grp.id },
      update: { featuresJson: grp.featuresJson },
      create: {
        id: grp.id,
        tenantId: this.getTenantIdOrThrow(),
        name: grp.name,
        entityType: grp.entityType,
        featuresJson: grp.featuresJson,
      },
    });
  }
}

export class MlModelRegistryRepository extends BaseTenantRepository {
  async save(model: MlModelRegistry): Promise<void> {
    await prisma.mlModelRegistry.upsert({
      where: { id: model.id },
      update: { accuracy: model.accuracy, status: model.status, endpointUrl: model.endpointUrl },
      create: {
        id: model.id,
        tenantId: this.getTenantIdOrThrow(),
        modelName: model.modelName,
        version: model.modelVersion,
        algorithm: model.algorithm,
        accuracy: model.accuracy,
        status: model.status,
        endpointUrl: model.endpointUrl,
      },
    });
  }

  async findById(id: string): Promise<MlModelRegistry | null> {
    const row = await prisma.mlModelRegistry.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new MlModelRegistry(row.id, {
      tenantId: row.tenantId,
      modelName: row.modelName,
      version: row.version,
      algorithm: row.algorithm,
      accuracy: row.accuracy,
      status: row.status,
      endpointUrl: row.endpointUrl ?? undefined,
    });
  }
}
