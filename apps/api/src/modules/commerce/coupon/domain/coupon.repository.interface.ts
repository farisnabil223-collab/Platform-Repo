export interface ICouponRepository {
  findById(id: string): Promise<any | null>;
  findByCode(code: string): Promise<any | null>;
  findMany(params: { page: number; limit: number }): Promise<{ items: any[]; total: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  softDelete(id: string): Promise<any>;
}

export const ICouponRepository = Symbol('ICouponRepository');
