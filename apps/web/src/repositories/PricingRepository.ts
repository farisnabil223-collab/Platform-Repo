import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
}

const FALLBACK_PLANS: PricingPlan[] = [
  { id: 'plan-1', name: 'Free Scholar', price: '$0', period: 'forever', description: 'Basic quest access & community lounges.', features: ['Access open lectures', 'Community lounges', '500 Initial XP'], ctaText: 'Start Free' },
  { id: 'plan-2', name: 'Course Pass', price: '$49', period: 'one-time', description: 'Full access to a single course module.', features: ['Lifetime module access', 'Certificates of completion', 'Direct mentor Q&A'], popular: true, ctaText: 'Get Pass' },
  { id: 'plan-3', name: 'Annual Pass', price: '$199', period: 'per year', description: 'Unlimited access to all platform courses.', features: ['All courses included', '1-on-1 Mentorship sessions', 'Exclusive XP badges'], ctaText: 'Subscribe Annual' },
];

class PricingRepository extends BaseRepository {
  async getAll(): Promise<PricingPlan[]> {
    try {
      const response = await api.get<any>('/public/pricing');
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return FALLBACK_PLANS;
    } catch (error) {
      this.handleError('getAllPricingPlans', error);
      return FALLBACK_PLANS;
    }
  }
}

export const pricingRepository = new PricingRepository();
export default pricingRepository;
