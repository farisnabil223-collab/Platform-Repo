import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    discountPrice?: number;
    type: string;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

class CartRepository extends BaseRepository {
  async get(): Promise<Cart | null> {
    try {
      const response = await api.get<Cart>('/student/cart');
      return response.data || null;
    } catch (error) {
      this.handleError('getCart', error);
      return null;
    }
  }

  async add(productId: string, quantity = 1): Promise<boolean> {
    try {
      await api.post('/student/cart/add', { productId, quantity });
      return true;
    } catch (error) {
      this.handleError('addToCart', error);
      return false;
    }
  }

  async updateItem(itemId: string, quantity: number): Promise<boolean> {
    try {
      await api.put(`/student/cart/item/${itemId}`, { quantity });
      return true;
    } catch (error) {
      this.handleError('updateCartItem', error);
      return false;
    }
  }

  async removeItem(itemId: string): Promise<boolean> {
    try {
      await api.delete(`/student/cart/item/${itemId}`);
      return true;
    } catch (error) {
      this.handleError('removeItem', error);
      return false;
    }
  }

  async calculate(couponCode?: string): Promise<{
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    couponId?: string;
  } | null> {
    try {
      const response = await api.post<{
        subtotal: number;
        discount: number;
        tax: number;
        total: number;
        couponId?: string;
      }>('/student/cart/calculate', { couponCode });
      return response.data || null;
    } catch (error) {
      this.handleError('calculateCart', error);
      return null;
    }
  }
}

export const cartRepository = new CartRepository();
export default cartRepository;
