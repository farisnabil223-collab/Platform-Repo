import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Sarah L.', role: 'Parent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', quote: 'The Calculus course transformed my daughter\'s understanding of derivatives. Her test scores increased from C to A in weeks!', rating: 5 },
  { id: 'test-2', name: 'David K.', role: 'Student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', quote: 'Operating Systems course is incredible. Hands-on bare metal C scheduling assignments gave me deep system insights.', rating: 5 },
  { id: 'test-3', name: 'Mrs. Cynthia M.', role: 'Parent', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', quote: 'EduVerse provided my home-schooled son with university-grade physics materials that are both interactive and engaging.', rating: 5 },
];

class TestimonialsRepository extends BaseRepository {
  async getAll(): Promise<Testimonial[]> {
    try {
      const response = await api.get<any>('/public/testimonials');
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return FALLBACK_TESTIMONIALS;
    } catch (error) {
      this.handleError('getAllTestimonials', error);
      return FALLBACK_TESTIMONIALS;
    }
  }
}

export const testimonialsRepository = new TestimonialsRepository();
export default testimonialsRepository;
