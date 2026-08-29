import { ProductWorkflowStatus, ProductVisibility } from '@prisma/client';

export interface IProductRepository {
  findById(id: string): Promise<any | null>;
  findBySlug(slug: string): Promise<any | null>;
  findMany(params: {
    type?: string;
    status?: ProductWorkflowStatus;
    visibility?: ProductVisibility;
    page: number;
    limit: number;
    search?: string;
    sort?: string;
  }): Promise<{ items: any[]; total: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  softDelete(id: string): Promise<any>;
  createPriceHistory(data: any): Promise<any>;
  getPriceHistory(productId: string): Promise<any[]>;
}

export const IProductRepository = Symbol('IProductRepository');
