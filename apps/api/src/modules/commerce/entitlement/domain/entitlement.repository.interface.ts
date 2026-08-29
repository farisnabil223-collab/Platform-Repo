export interface IEntitlementRepository {
  findMany(params: { ownerId: string; page: number; limit: number }): Promise<{ items: any[]; total: number }>;
  findActiveByOwnerAndProduct(ownerId: string, productId: string): Promise<any | null>;
  create(data: any): Promise<any>;
  updateStatus(id: string, status: string): Promise<any>;
}

export const IEntitlementRepository = Symbol('IEntitlementRepository');
