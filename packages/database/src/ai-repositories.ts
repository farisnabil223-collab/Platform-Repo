import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import { ModelRegistry, PromptTemplate, KnowledgeSource } from '@eduverse/kernel';

export class ModelRegistryRepository {
  async save(model: ModelRegistry): Promise<void> {
    await prisma.modelRegistry.upsert({
      where: { modelName: model.modelName },
      update: {
        provider: model.provider,
        version: model.versionString,
        capabilities: model.capabilities,
        contextWindow: model.contextWindow,
        tokenLimits: model.tokenLimits,
        inputCost: model.inputCost,
        outputCost: model.outputCost,
        latencyMs: model.latencyMs,
        availability: model.availability,
        status: model.status,
      },
      create: {
        id: model.id,
        provider: model.provider,
        modelName: model.modelName,
        version: model.versionString,
        capabilities: model.capabilities,
        contextWindow: model.contextWindow,
        tokenLimits: model.tokenLimits,
        inputCost: model.inputCost,
        outputCost: model.outputCost,
        latencyMs: model.latencyMs,
        availability: model.availability,
        status: model.status,
      },
    });
  }

  async findMany(): Promise<ModelRegistry[]> {
    const list = await prisma.modelRegistry.findMany();
    return list.map((item: any) => new ModelRegistry(item.id, {
      provider: item.provider,
      modelName: item.modelName,
      version: item.version,
      capabilities: item.capabilities,
      contextWindow: item.contextWindow,
      tokenLimits: item.tokenLimits,
      inputCost: item.inputCost,
      outputCost: item.outputCost,
      latencyMs: item.latencyMs,
      availability: item.availability,
      status: item.status,
    }));
  }
}

export class PromptTemplateRepository {
  async save(prompt: PromptTemplate): Promise<void> {
    await prisma.promptTemplate.upsert({
      where: { code: prompt.code },
      update: {
        category: prompt.category,
        contentTemplate: prompt.contentTemplate,
        version: prompt.templateVersion,
        approved: prompt.approved,
        tags: prompt.tags,
        metadata: prompt.metadata,
      },
      create: {
        id: prompt.id,
        code: prompt.code,
        category: prompt.category,
        contentTemplate: prompt.contentTemplate,
        version: prompt.templateVersion,
        approved: prompt.approved,
        tags: prompt.tags,
        metadata: prompt.metadata,
      },
    });
  }

  async findByCode(code: string): Promise<PromptTemplate | null> {
    const item = await prisma.promptTemplate.findUnique({ where: { code } });
    if (!item) return null;
    return new PromptTemplate(item.id, {
      code: item.code,
      category: item.category,
      contentTemplate: item.contentTemplate,
      templateVersion: item.version,
      approved: item.approved,
      tags: item.tags,
      metadata: item.metadata,
    });
  }
}

export class KnowledgeSourceRepository extends BaseTenantRepository {
  async save(source: KnowledgeSource): Promise<void> {
    await prisma.knowledgeSource.create({
      data: {
        id: source.id,
        tenantId: this.getTenantIdOrThrow(),
        name: source.name,
        category: source.category,
        accessPolicy: source.accessPolicy,
      },
    });
  }

  async findMany(): Promise<KnowledgeSource[]> {
    const tenantId = this.getTenantIdOrThrow();
    const list = await prisma.knowledgeSource.findMany({
      where: { tenantId },
    });
    return list.map((item: any) => new KnowledgeSource(item.id, {
      tenantId: item.tenantId,
      name: item.name,
      category: item.category,
      accessPolicy: item.accessPolicy,
    }));
  }
}
