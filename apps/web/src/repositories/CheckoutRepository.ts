import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface CheckoutResult {
  order: any;
  paymentUrl?: string;
  intentId?: string;
}

class CheckoutRepository extends BaseRepository {
  async checkout(couponCode?: string): Promise<CheckoutResult | null> {
    try {
      const response = await api.post<CheckoutResult>('/student/checkout', { couponCode });
      return response.data || null;
    } catch (error) {
      this.handleError('checkout', error);
      return null;
    }
  }

  async getOrders(page = 1, limit = 10): Promise<{ items: any[]; total: number } | null> {
    try {
      const response = await api.get<{ items: any[]; total: number }>(`/student/orders?page=${page}&limit=${limit}`);
      return response.data || null;
    } catch (error) {
      this.handleError('getOrders', error);
      return null;
    }
  }

  async getOrderById(id: string): Promise<any | null> {
    try {
      const response = await api.get(`/student/orders/${id}`);
      return response.data || null;
    } catch (error) {
      this.handleError('getOrderById', error);
      return null;
    }
  }

  async simulateWebhookSuccess(orderId: string, transactionId: string): Promise<boolean> {
    try {
      await api.post('/student/payment/webhook', {
        orderId,
        status: 'success',
        transactionId,
      });
      return true;
    } catch (error) {
      this.handleError('simulateWebhookSuccess', error);
      return false;
    }
  }
}

export const checkoutRepository = new CheckoutRepository();
export default checkoutRepository;
