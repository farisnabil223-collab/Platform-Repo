import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../domain/cart.repository.interface';
import { IProductRepository } from '../../product/domain/product.repository.interface';
import { CartPricingService, CanPurchaseProductSpec, Money } from '@eduverse/shared-domain';
import { generateUuidV7 } from '@eduverse/kernel';
import { prisma } from '@eduverse/database';

@Injectable()
export class CartService {
  constructor(
    @Inject(ICartRepository)
    private readonly cartRepo: ICartRepository,
    @Inject(IProductRepository)
    private readonly productRepo: IProductRepository
  ) {}

  private getExpirationDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Expires in 7 days
    return date;
  }

  async getOrCreateCart(userId: string) {
    let cart = await this.cartRepo.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepo.create(userId, this.getExpirationDate());
    } else {
      // Check expiration
      if (cart.expiresAt < new Date()) {
        // Expired, clear and reset
        await this.cartRepo.clear(userId);
        cart = await this.cartRepo.update(userId, {
          expiresAt: this.getExpirationDate(),
          inactiveReason: null,
        });
      }
    }
    return cart;
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    // Validation using Specification pattern
    const spec = new CanPurchaseProductSpec();
    if (!spec.isSatisfiedBy(product)) {
      throw new BadRequestException('Product is not available for purchase');
    }

    // Check duplicate
    const existing = cart.items.find((i: any) => i.productId === productId);
    if (existing) {
      throw new BadRequestException('Product already exists in cart');
    }

    // Prevent mixing incompatible subscriptions
    if (product.type.includes('SUBSCRIPTION')) {
      const hasSubscription = cart.items.some((i: any) => i.product.type.includes('SUBSCRIPTION'));
      if (hasSubscription) {
        throw new BadRequestException('Cannot mix multiple subscriptions in a single cart');
      }
    }

    // Add item using prisma directly inside transaction/repository update
    await prisma.cartItem.create({
      data: {
        id: generateUuidV7(),
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i: any) => i.productId === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    return this.getOrCreateCart(userId);
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i: any) => i.productId === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getOrCreateCart(userId);
  }

  async calculateCartTotals(userId: string, appliedCouponCode?: string) {
    const cart = await this.getOrCreateCart(userId);
    const items = cart.items.map((i: any) => ({
      price: i.product.price.toNumber ? i.product.price.toNumber() : Number(i.product.price),
      discountPrice: i.product.discountPrice
        ? (i.product.discountPrice.toNumber ? i.product.discountPrice.toNumber() : Number(i.product.discountPrice))
        : undefined,
      quantity: i.quantity,
    }));

    let discountAmount = Money.zero('USD');

    if (appliedCouponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: appliedCouponCode },
      });
      if (coupon && coupon.isActive) {
        // Calculate subtotal first to validate discount
        const subResult = CartPricingService.calculate(items, 'USD', Money.zero('USD'));
        if (coupon.type === 'PERCENTAGE') {
          discountAmount = subResult.subtotal.multiply(coupon.value / 100);
        } else {
          discountAmount = Money.create(coupon.value, 'USD');
        }
      }
    }

    const pricing = CartPricingService.calculate(items, 'USD', discountAmount);

    return {
      subtotal: pricing.subtotal.toNumber(),
      discount: pricing.discountAmount.toNumber(),
      tax: pricing.taxAmount.toNumber(),
      total: pricing.totalAmount.toNumber(),
    };
  }

  async clearCart(userId: string, tx?: any) {
    return this.cartRepo.clear(userId, tx);
  }
}
