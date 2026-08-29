import { Injectable, Inject, NotFoundException, Optional } from '@nestjs/common';
import { IProductRepository } from '../domain/product.repository.interface';
import { generateUuidV7 } from '@eduverse/kernel';
import { Decimal } from '@eduverse/shared-domain';
import { ProductWorkflowStatus, ProductVisibility } from '@prisma/client';
import { ICacheProvider } from '../../../catalog/domain/cache-provider.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepo: IProductRepository,
    @Optional()
    @Inject(ICacheProvider)
    private readonly cacheProvider?: ICacheProvider
  ) {}

  async getProducts(params: {
    type?: string;
    status?: ProductWorkflowStatus;
    visibility?: ProductVisibility;
    page: number;
    limit: number;
    search?: string;
    sort?: string;
  }) {
    const { items, total } = await this.productRepo.findMany(params);
    return {
      items,
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async getProductBySlug(slug: string) {
    const cacheKey = `product:slug:${slug}`;
    if (this.cacheProvider) {
      const cached = await this.cacheProvider.get<any>(cacheKey);
      if (cached) return cached;
    }

    const product = await this.productRepo.findBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');

    if (this.cacheProvider) {
      await this.cacheProvider.set(cacheKey, product, 300); // 5 min TTL
    }
    return product;
  }

  async getProductById(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(dto: any, userId?: string) {
    const id = generateUuidV7();
    const product = await this.productRepo.create({
      id,
      ...dto,
      price: new Decimal(dto.price),
      discountPrice: dto.discountPrice ? new Decimal(dto.discountPrice) : null,
      status: 'DRAFT',
      visibility: 'PUBLIC',
      version: 1,
      publishedVersion: 1,
      draftVersion: 1,
      isDraft: true,
      createdBy: userId || null,
    });

    // Initial price history
    await this.productRepo.createPriceHistory({
      id: generateUuidV7(),
      productId: id,
      oldPrice: new Decimal(0),
      newPrice: new Decimal(dto.price),
      reason: 'Initial setup',
      changedBy: userId || null,
    });

    return product;
  }

  private async evictCache(slug?: string) {
    if (slug && this.cacheProvider) {
      await this.cacheProvider.del(`product:slug:${slug}`);
    }
  }

  async updateProduct(id: string, dto: any, userId?: string) {
    const product = await this.getProductById(id);
    const result = await this.productRepo.update(id, {
      ...dto,
      updatedBy: userId || null,
    });
    await this.evictCache(product.slug);
    return result;
  }

  async updateProductPrice(id: string, newPrice: number, newDiscountPrice?: number, reason?: string, userId?: string) {
    const product = await this.getProductById(id);
    const oldPrice = product.price;

    const updated = await this.productRepo.update(id, {
      price: new Decimal(newPrice),
      discountPrice: newDiscountPrice ? new Decimal(newDiscountPrice) : null,
      updatedBy: userId || null,
    });

    await this.productRepo.createPriceHistory({
      id: generateUuidV7(),
      productId: id,
      oldPrice,
      newPrice: new Decimal(newPrice),
      reason: reason || 'Price update',
      changedBy: userId || null,
    });

    await this.evictCache(product.slug);
    return updated;
  }

  async submitForApproval(id: string) {
    const product = await this.getProductById(id);
    const result = await this.productRepo.update(id, {
      status: 'SUBMITTED',
    });
    await this.evictCache(product.slug);
    return result;
  }

  async approveProduct(id: string) {
    const product = await this.getProductById(id);
    const result = await this.productRepo.update(id, {
      status: 'APPROVED',
    });
    await this.evictCache(product.slug);
    return result;
  }

  async publishProduct(id: string) {
    const product = await this.getProductById(id);
    const nextVer = product.version + 1;
    const result = await this.productRepo.update(id, {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      isDraft: false,
      publishedVersion: nextVer,
      version: nextVer,
    });
    await this.evictCache(product.slug);
    return result;
  }

  async deleteProduct(id: string) {
    const product = await this.getProductById(id);
    const result = await this.productRepo.softDelete(id);
    await this.evictCache(product.slug);
    return result;
  }

  async getPriceHistory(productId: string) {
    return this.productRepo.getPriceHistory(productId);
  }
}
