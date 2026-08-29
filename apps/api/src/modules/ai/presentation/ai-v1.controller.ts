import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { prisma, ModelRegistryRepository, PromptTemplateRepository } from '@eduverse/database';
import { generateUuidV7, ModelRegistry, PromptTemplate, AIOrchestrator, AISafetyEngine } from '@eduverse/kernel';

@ApiTags('AI & Intelligent Learning Platform')
@Controller('ai')
export class AIController {
  private readonly modelRepo = new ModelRegistryRepository();
  private readonly promptRepo = new PromptTemplateRepository();
  private readonly orchestrator = new AIOrchestrator();
  private readonly safety = new AISafetyEngine();

  // 1. Model Registry Routing
  @Post('models')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register/Update LLM capability records' })
  async registerModel(@Body() body: {
    provider: string;
    modelName: string;
    version: string;
    capabilities: any;
    contextWindow: number;
    tokenLimits: number;
    inputCost: number;
    outputCost: number;
    latencyMs: number;
    availability?: number;
    status: string;
  }) {
    const model = new ModelRegistry(generateUuidV7(), {
      provider: body.provider,
      modelName: body.modelName,
      version: body.version,
      capabilities: body.capabilities,
      contextWindow: body.contextWindow,
      tokenLimits: body.tokenLimits,
      inputCost: body.inputCost,
      outputCost: body.outputCost,
      latencyMs: body.latencyMs,
      availability: body.availability ?? 1.0,
      status: body.status,
    });
    await this.modelRepo.save(model);
    return { success: true, modelId: model.id };
  }

  // 2. Prompt Management
  @Post('prompts')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create versioned prompt templates' })
  async createPrompt(@Body() body: {
    code: string;
    category: string;
    contentTemplate: string;
    version: string;
    tags: string;
    metadata: any;
  }) {
    const prompt = new PromptTemplate(generateUuidV7(), {
      code: body.code,
      category: body.category,
      contentTemplate: body.contentTemplate,
      templateVersion: body.version,
      approved: false,
      tags: body.tags,
      metadata: body.metadata,
    });
    await this.promptRepo.save(prompt);
    return { success: true, promptId: prompt.id };
  }

  // 3. AI Tutor Chat with Safety Moderation and Socratic logic
  @Post('tutor/chat')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit user message to conversational AI tutor' })
  async chatWithTutor(@Body() body: { message: string }) {
    // Safety Validation: Prompt Injection detection
    if (!this.safety.isPromptSafe(body.message)) {
      throw new BadRequestException('Security threat detected: Prompt contains potential injection patterns');
    }

    // Safety Masking: PII check
    const cleanMessage = this.safety.maskPII(body.message);

    // AI model selection failover strategy
    const models = await this.modelRepo.findMany();
    const optimalModel = this.orchestrator.selectModel(models, 'LATENCY');

    // Socratic guiding response mock logic
    const tutorResponse = `I see you wrote: "${cleanMessage}". Can you explain why you chose this approach? Let's take it step-by-step.`;

    return {
      response: tutorResponse,
      modelUsed: optimalModel.modelName,
      safetyValidated: true,
      citationMetadata: ['EduVerse AI Knowledge Base Hub v1'],
    };
  }

  // 4. RAG Collection Cosine Similarity Match
  @Post('search/semantic')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perform similarity matching on embedded chunks' })
  async searchSemantic(@Body() body: { queryEmbedding: number[]; limit?: number }) {
    const chunks = await prisma.knowledgeChunk.findMany();
    const scored = chunks.map((chunk: any) => {
      const parsedEmbedding = typeof chunk.embedding === 'string'
        ? JSON.parse(chunk.embedding)
        : chunk.embedding;
      const score = this.orchestrator.calculateCosineSimilarity(body.queryEmbedding, parsedEmbedding as number[]);
      return {
        chunkId: chunk.id,
        chunkText: chunk.chunkText,
        citation: chunk.citation,
        similarityScore: score,
      };
    });

    const sorted = scored
      .filter(item => item.similarityScore > 0.1)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    return sorted.slice(0, body.limit ?? 5);
  }

  // 5. Intelligent Recommendations
  @Get('recommendations')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student recommendations path' })
  async getRecommendations() {
    return {
      learningPath: ['Advanced NestJS Patterns', 'DDD Architecture in TypeScript'],
      suggestedLessons: ['AsyncLocalStorage Context Handling', 'Star Schema BI Aggregations'],
      suggestedCareer: ['Cloud SaaS Solutions Architect'],
    };
  }
}
