import { Injectable, Inject } from '@nestjs/common';
import { IEntitlementRepository } from '../domain/entitlement.repository.interface';
import { generateUuidV7 } from '@eduverse/kernel';
import { EntitlementType, EntitlementStatus, GrantSource } from '@prisma/client';

@Injectable()
export class EntitlementService {
  constructor(
    @Inject(IEntitlementRepository)
    private readonly entitlementRepo: IEntitlementRepository
  ) {}

  async checkAccess(ownerId: string, productId: string): Promise<boolean> {
    const entitlement = await this.entitlementRepo.findActiveByOwnerAndProduct(ownerId, productId);
    return !!entitlement;
  }

  async getEntitlements(ownerId: string, page: number, limit: number) {
    const data = await this.entitlementRepo.findMany({ ownerId, page, limit });
    return {
      items: data.items,
      page,
      limit,
      total: data.total,
      totalPages: Math.ceil(data.total / limit),
    };
  }

  async grantEntitlement(data: {
    ownerId: string;
    productId: string;
    type: EntitlementType;
    subscriptionId?: string;
    orderId?: string;
    expiresAt?: Date;
    grantSource: GrantSource;
  }) {
    return this.entitlementRepo.create({
      id: generateUuidV7(),
      ownerId: data.ownerId,
      productId: data.productId,
      type: data.type,
      subscriptionId: data.subscriptionId || null,
      orderId: data.orderId || null,
      expiresAt: data.expiresAt || null,
      status: 'ACTIVE',
      grantSource: data.grantSource,
    });
  }
}
