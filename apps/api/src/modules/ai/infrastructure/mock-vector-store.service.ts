import { Injectable } from '@nestjs/common';
import { IVectorStore } from '../domain/vector-store.interface';

@Injectable()
export class MockVectorStoreService implements IVectorStore {
  private store: { documentId: string; vector: number[]; text: string }[] = [];

  async saveDocumentVector(documentId: string, vector: number[], text: string): Promise<void> {
    this.store.push({ documentId, vector, text });
  }

  async similaritySearch(queryVector: number[], limit = 3): Promise<{ documentId: string; text: string; score: number }[]> {
    return this.store
      .map((doc) => {
        // Simple dot product mock similarity
        const score = doc.vector.slice(0, 10).reduce((acc, val, i) => acc + val * (queryVector[i] || 0), 0);
        return { documentId: doc.documentId, text: doc.text, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
