export interface ICartRepository {
  findByUserId(userId: string): Promise<any | null>;
  create(userId: string, expiresAt: Date): Promise<any>;
  update(userId: string, data: any, tx?: any): Promise<any>;
  clear(userId: string, tx?: any): Promise<any>;
}

export const ICartRepository = Symbol('ICartRepository');
