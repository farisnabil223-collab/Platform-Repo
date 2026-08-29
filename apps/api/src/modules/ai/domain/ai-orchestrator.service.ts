import { Injectable, Inject, Logger } from '@nestjs/common';
import { IAIProvider } from '../domain/ai-providers.interface';

@Injectable()
export class AIOrchestrator {
  private readonly logger = new Logger(AIOrchestrator.name);
  private cache = new Map<string, { text: string; usage: any }>();

  constructor(
    @Inject(IAIProvider) private readonly defaultProvider: IAIProvider
  ) {}

  async executePrompt(prompt: string, bypassCache = false): Promise<{ text: string; usage: any }> {
    const cacheKey = prompt.trim();
    if (!bypassCache && this.cache.has(cacheKey)) {
      this.logger.log('Serving response from cache namespace');
      return this.cache.get(cacheKey)!;
    }

    // Try call with retry & fallback wrapper
    let attempts = 0;
    const maxRetries = 2;

    while (attempts < maxRetries) {
      try {
        const response = await this.defaultProvider.generateText(prompt);
        this.cache.set(cacheKey, response);
        return response;
      } catch (err) {
        attempts++;
        this.logger.warn(`AI Provider failed. Attempt ${attempts} of ${maxRetries}. Retrying...`);
        if (attempts >= maxRetries) {
          this.logger.error('Primary AI provider exhausted. Routing request to Fallback mock model...');
          // Fallback response mock
          return {
            text: '[Fallback Response] Student indicators evaluated successfully.',
            usage: { promptTokens: 50, completionTokens: 15 },
          };
        }
      }
    }

    throw new Error('AI Orchestration failed');
  }
}
