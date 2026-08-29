import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  DataLakeDatasetRepository,
  ETLPipelineRepository,
  PipelineExecutionRepository,
  DataLineageNodeRepository,
  DataLineageEdgeRepository,
  DataQualityRuleRepository,
  DataQualityIssueRepository,
  CatalogEntryRepository,
  GovernancePolicyRepository,
  BiKpiDefinitionRepository,
  ExecutiveScorecardRepository,
  FeatureStoreGroupRepository,
  MlModelRegistryRepository
} from '@eduverse/database';
import {
  generateUuidV7,
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
  MlModelRegistry,
  PipelineExecutionEngine,
  DataGovernanceEngine,
  MlInferenceEvaluator,
  ExecutiveInsightEngine,
  DomainEventBus,
  DatasetCreated,
  DatasetUpdated,
  PipelineStarted,
  PipelineCompleted,
  PipelineFailed,
  WarehouseUpdated,
  DataQualityPassed,
  DataQualityFailed,
  ModelTrained,
  ModelDeployed,
  PredictionGenerated,
  DashboardPublished
} from '@eduverse/kernel';

@ApiTags('Enterprise Data Platform & Business Intelligence')
@Controller('data')
export class DataController {
  private readonly datasetRepo = new DataLakeDatasetRepository();
  private readonly pipeRepo = new ETLPipelineRepository();
  private readonly execRepo = new PipelineExecutionRepository();
  private readonly nodeRepo = new DataLineageNodeRepository();
  private readonly edgeRepo = new DataLineageEdgeRepository();
  private readonly ruleRepo = new DataQualityRuleRepository();
  private readonly issueRepo = new DataQualityIssueRepository();
  private readonly catRepo = new CatalogEntryRepository();
  private readonly govRepo = new GovernancePolicyRepository();
  private readonly kpiRepo = new BiKpiDefinitionRepository();
  private readonly cardRepo = new ExecutiveScorecardRepository();
  private readonly grpRepo = new FeatureStoreGroupRepository();
  private readonly mlRepo = new MlModelRegistryRepository();

  private readonly etlEngine = new PipelineExecutionEngine();
  private readonly govEngine = new DataGovernanceEngine();
  private readonly mlEvaluator = new MlInferenceEvaluator();
  private readonly aiNarrativeEngine = new ExecutiveInsightEngine();

  // 1. Data Lake & Zones
  @Post('datasets')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Data Lake zone datasets' })
  async createDataset(@Request() req: any, @Body() body: {
    name: string;
    zone?: string;
    format?: string;
    version?: number;
    configJson: any;
  }) {
    const dataset = new DataLakeDataset(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      zone: body.zone ?? 'RAW',
      format: body.format ?? 'PARQUET',
      version: body.version ?? 1,
      configJson: body.configJson,
    });
    await this.datasetRepo.save(dataset);
    await DomainEventBus.getInstance().publish(new DatasetCreated(dataset.id));
    return { success: true, datasetId: dataset.id };
  }

  // 2. ETL/ELT Pipelines
  @Post('pipelines')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Define ETL/ELT data transformation pipeline' })
  async createPipeline(@Request() req: any, @Body() body: {
    name: string;
    schedule?: string;
    configJson: any;
  }) {
    const pipe = new ETLPipeline(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      schedule: body.schedule,
      status: 'IDLE',
      configJson: body.configJson,
    });
    await this.pipeRepo.save(pipe);
    return { success: true, pipelineId: pipe.id };
  }

  @Post('pipelines/execute')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger ETL pipeline execution run' })
  async executePipeline(@Request() req: any, @Body() body: { pipelineId: string }) {
    const pipe = await this.pipeRepo.findById(body.pipelineId);
    if (!pipe) throw new BadRequestException('ETL Pipeline not found');

    const result = this.etlEngine.runPipeline(pipe.configJson);

    const exec = new PipelineExecution(generateUuidV7(), {
      tenantId: req.user.tenantId,
      pipelineId: pipe.id,
      status: result.status,
      records: result.recordsProcessed,
      completedAt: new Date(),
    });
    await this.execRepo.save(exec);

    await DomainEventBus.getInstance().publish(new PipelineStarted(exec.id, pipe.id));
    await DomainEventBus.getInstance().publish(new PipelineCompleted(exec.id, result.recordsProcessed));

    return { success: true, executionId: exec.id, recordsProcessed: result.recordsProcessed };
  }

  // 3. Data Lineage Graph
  @Post('lineage/nodes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Data Lineage DAG node' })
  async createLineageNode(@Request() req: any, @Body() body: {
    name: string;
    nodeType: string;
    metaJson: any;
  }) {
    const node = new DataLineageNode(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      nodeType: body.nodeType,
      metaJson: body.metaJson,
    });
    await this.nodeRepo.save(node);
    return { success: true, nodeId: node.id };
  }

  @Post('lineage/edges')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Connect Data Lineage dependency edge' })
  async createLineageEdge(@Request() req: any, @Body() body: {
    sourceId: string;
    targetId: string;
    label?: string;
  }) {
    const edge = new DataLineageEdge(generateUuidV7(), {
      tenantId: req.user.tenantId,
      sourceId: body.sourceId,
      targetId: body.targetId,
      label: body.label,
    });
    await this.edgeRepo.save(edge);
    return { success: true, edgeId: edge.id };
  }

  // 4. Data Quality & Governance
  @Post('quality/rules')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure Data Quality evaluation rule' })
  async createQualityRule(@Request() req: any, @Body() body: {
    datasetId: string;
    ruleType: string;
    configJson: any;
    score?: number;
  }) {
    const rule = new DataQualityRule(generateUuidV7(), {
      tenantId: req.user.tenantId,
      datasetId: body.datasetId,
      ruleType: body.ruleType,
      configJson: body.configJson,
      score: body.score ?? 100.0,
    });
    await this.ruleRepo.save(rule);
    await DomainEventBus.getInstance().publish(new DataQualityPassed(rule.id));
    return { success: true, ruleId: rule.id };
  }

  @Post('catalog')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register entity in Data Catalog' })
  async createCatalogEntry(@Request() req: any, @Body() body: {
    entityName: string;
    classification?: string;
    ownerEmail: string;
    glossaryJson: any;
  }) {
    const cat = new CatalogEntry(generateUuidV7(), {
      tenantId: req.user.tenantId,
      entityName: body.entityName,
      classification: body.classification ?? 'INTERNAL',
      ownerEmail: body.ownerEmail,
      glossaryJson: body.glossaryJson,
    });
    await this.catRepo.save(cat);
    return { success: true, catalogId: cat.id };
  }

  @Post('governance')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save Data Governance retention and masking policies' })
  async createGovernancePolicy(@Request() req: any, @Body() body: {
    policyName: string;
    retentionDays?: number;
    maskingRules: any;
  }) {
    const pol = new GovernancePolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      policyName: body.policyName,
      retentionDays: body.retentionDays ?? 365,
      maskingRules: body.maskingRules,
    });
    await this.govRepo.save(pol);
    return { success: true, policyId: pol.id };
  }

  // 5. Business Intelligence & Executive Scorecards
  @Post('kpis')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Define BI Key Performance Indicators (KPIs)' })
  async createKpi(@Request() req: any, @Body() body: {
    metricName: string;
    category?: string;
    targetValue: number;
    dimensionsJson: any;
  }) {
    const kpi = new BiKpiDefinition(generateUuidV7(), {
      tenantId: req.user.tenantId,
      metricName: body.metricName,
      category: body.category ?? 'ACADEMIC',
      targetValue: body.targetValue,
      dimensionsJson: body.dimensionsJson,
    });
    await this.kpiRepo.save(kpi);
    return { success: true, kpiId: kpi.id };
  }

  @Post('scorecards')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create executive scorecards' })
  async createScorecard(@Request() req: any, @Body() body: {
    title: string;
    scorecardsJson: any;
  }) {
    const card = new ExecutiveScorecard(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      scorecardsJson: body.scorecardsJson,
    });
    await this.cardRepo.save(card);
    await DomainEventBus.getInstance().publish(new DashboardPublished(card.id));
    return { success: true, scorecardId: card.id };
  }

  // 6. Feature Store & Machine Learning Platform
  @Post('feature-store')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register ML feature store groups' })
  async createFeatureGroup(@Request() req: any, @Body() body: {
    name: string;
    entityType: string;
    featuresJson: any;
  }) {
    const grp = new FeatureStoreGroup(generateUuidV7(), {
      tenantId: req.user.tenantId,
      name: body.name,
      entityType: body.entityType,
      featuresJson: body.featuresJson,
    });
    await this.grpRepo.save(grp);
    return { success: true, groupId: grp.id };
  }

  @Post('ml/models')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register ML model definitions' })
  async createMlModel(@Request() req: any, @Body() body: {
    modelName: string;
    version: string;
    algorithm: string;
    accuracy: number;
    endpointUrl?: string;
  }) {
    const model = new MlModelRegistry(generateUuidV7(), {
      tenantId: req.user.tenantId,
      modelName: body.modelName,
      version: body.version,
      algorithm: body.algorithm,
      accuracy: body.accuracy,
      status: 'DEPLOYED',
      endpointUrl: body.endpointUrl,
    });
    await this.mlRepo.save(model);
    await DomainEventBus.getInstance().publish(new ModelTrained(model.id, body.accuracy));
    if (body.endpointUrl) {
      await DomainEventBus.getInstance().publish(new ModelDeployed(model.id, body.endpointUrl));
    }
    return { success: true, modelId: model.id };
  }

  @Post('ml/predict')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Run ML predictive inference dropout risk calculations' })
  async predict(@Body() body: { studentFeatures: Record<string, any> }) {
    const prediction = this.mlEvaluator.predictDropoutRisk(body.studentFeatures);
    return { success: true, prediction };
  }

  @Post('ai/narrative')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate AI executive narrative reports' })
  async generateNarrative(@Body() body: { kpis: Record<string, number> }) {
    const narrative = this.aiNarrativeEngine.generateExecutiveNarrative(body.kpis);
    return { success: true, narrative };
  }
}
