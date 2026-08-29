export interface IAIProvider {
  getProviderName(): string;
  generateText(prompt: string, options?: any): Promise<{ text: string; usage: { promptTokens: number; completionTokens: number } }>;
}
export const IAIProvider = Symbol('IAIProvider');

export interface IChatProvider {
  sendMessage(sessionId: string, message: string): Promise<{ reply: string; usage: { promptTokens: number; completionTokens: number } }>;
}
export const IChatProvider = Symbol('IChatProvider');

export interface IEmbeddingProvider {
  getEmbedding(text: string): Promise<number[]>;
}
export const IEmbeddingProvider = Symbol('IEmbeddingProvider');

export interface IContentGenerationProvider {
  generateLessonContent(topic: string, gradeLevel: string): Promise<string>;
}
export const IContentGenerationProvider = Symbol('IContentGenerationProvider');

export interface IVisionProvider {
  analyzeDocument(fileBuffer: Buffer, mimeType: string): Promise<string>;
}
export const IVisionProvider = Symbol('IVisionProvider');

export interface ITranscriptionProvider {
  transcribeAudio(fileBuffer: Buffer): Promise<string>;
}
export const ITranscriptionProvider = Symbol('ITranscriptionProvider');
