import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface Teacher {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  bio: string;
  detailedBio?: string;
  specialties: string[];
  qualifications?: string;
  experienceYears?: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  verifiedBadge?: boolean;
  socials?: { twitter: string; linkedin: string; github: string };
  courses?: any[];
}

const FALLBACK_TEACHERS: Teacher[] = [
  {
    id: 't1111111-1111-4111-8111-111111111111',
    slug: 'tch-9932',
    name: 'Dr. Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Professor of Mathematics and Quantum Computation.',
    specialties: ['Mathematics', 'Calculus'],
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 145,
    studentsCount: 1420,
    verifiedBadge: true,
  },
  {
    id: 't2222222-2222-4222-8222-222222222222',
    slug: 'tch-9933',
    name: 'Dr. Arthur Feynman',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    bio: 'Instructor of Theoretical Wave Mechanics.',
    specialties: ['Physics', 'Quantum Mechanics'],
    experienceYears: 15,
    rating: 4.8,
    reviewsCount: 88,
    studentsCount: 850,
    verifiedBadge: true,
  },
  {
    id: 't3333333-3333-4333-8333-333333333333',
    slug: 'tch-9934',
    name: 'Prof. Linus Torvalds',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Instructor of Kernel Engineering & Low-Level Code.',
    specialties: ['Computer Science', 'Operating Systems'],
    experienceYears: 20,
    rating: 5.0,
    reviewsCount: 210,
    studentsCount: 2100,
    verifiedBadge: true,
  },
];

class TeachersRepository extends BaseRepository {
  async getAll(): Promise<Teacher[]> {
    try {
      const response = await api.get<any>('/public/teachers');
      if (response && response.data?.items && response.data.items.length > 0) {
        return response.data.items;
      }
      return FALLBACK_TEACHERS;
    } catch (error) {
      this.handleError('getAllTeachers', error);
      return FALLBACK_TEACHERS;
    }
  }

  async getBySlug(slug: string): Promise<Teacher | null> {
    try {
      const response = await api.get<any>(`/public/teachers/${slug}`);
      if (response && response.data) {
        return response.data;
      }
      return FALLBACK_TEACHERS.find(t => t.slug === slug || t.id === slug) || FALLBACK_TEACHERS[0];
    } catch (error) {
      this.handleError(`getTeacherBySlug(${slug})`, error);
      return FALLBACK_TEACHERS.find(t => t.slug === slug || t.id === slug) || FALLBACK_TEACHERS[0];
    }
  }
}

export const teachersRepository = new TeachersRepository();
export default teachersRepository;
