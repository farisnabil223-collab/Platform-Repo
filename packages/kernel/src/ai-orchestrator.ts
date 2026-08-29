import { ModelRegistry } from './ai-aggregates';

export class AIOrchestrator {
  selectModel(models: ModelRegistry[], strategy: 'COST' | 'LATENCY'): ModelRegistry {
    if (models.length === 0) {
      throw new Error('No available LLM models registered in orchestrator registry');
    }

    const activeModels = models.filter(m => m.status === 'ACTIVE');
    if (activeModels.length === 0) {
      // Fallback to local model if all cloud LLMs fail
      const local = models.find(m => m.provider === 'OLLAMA');
      if (local) return local;
      return models[0];
    }

    if (strategy === 'COST') {
      return activeModels.reduce((min, m) => m.inputCost < min.inputCost ? m : min, activeModels[0]);
    } else {
      return activeModels.reduce((min, m) => m.latencyMs < min.latencyMs ? m : min, activeModels[0]);
    }
  }

  calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
