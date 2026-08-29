import { logger } from '@eduverse/ui';

export class BaseRepository {
  protected handleError(context: string, error: any) {
    logger.error(`[Repository Error] ${context}:`, error);
    // Silent fail safe
    return null;
  }
}
