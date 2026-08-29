export interface IVectorStore {
  saveDocumentVector(documentId: string, vector: number[], text: string): Promise<void>;
  similaritySearch(queryVector: number[], limit?: number): Promise<{ documentId: string; text: string; score: number }[]>;
}
export const IVectorStore = Symbol('IVectorStore');
