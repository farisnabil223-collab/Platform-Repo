import { IPaginationMeta } from '@eduverse/kernel';

export class PaginationHelper {
  public static getSkipAndTake(page = 1, limit = 10): { skip: number; take: number } {
    const take = Math.min(Math.max(limit, 1), 100);
    const skip = (Math.max(page, 1) - 1) * take;
    return { skip, take };
  }

  public static buildMeta(totalItems: number, page = 1, limit = 10): IPaginationMeta {
    const take = Math.min(Math.max(limit, 1), 100);
    const totalPages = Math.ceil(totalItems / take);
    return {
      page: Math.max(page, 1),
      limit: take,
      totalItems,
      totalPages,
    };
  }
}
