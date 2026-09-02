import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface Course {
  id: string;
  title: string;
  slug: string;
  code: string;
  description: string;
  image?: string;
  longDescription: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  progress: number;
  category: string;
  status: string;
  modules?: any[];
  lessons?: any[];
  syllabus?: string;
  attendancePercent?: number;
  credits: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  requirements: string[];
  gradeLevel: string;
  reviews: any[];
}

const FALLBACK_COURSES: Course[] = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    code: 'MATH-101',
    slug: 'calculus-i-limits-integration',
    title: 'Calculus I: Limits & Integration',
    description: 'Master single-variable Calculus from the ground up. Limits, derivatives, integration techniques.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    longDescription: 'Master single-variable Calculus from the ground up.',
    instructorId: 't1111111-1111-4111-8111-111111111111',
    instructorName: 'Dr. Emily Watson',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    progress: 0,
    category: 'Mathematics',
    status: 'ACTIVE',
    credits: 3,
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.9,
    reviewsCount: 145,
    studentsCount: 1420,
    requirements: ['Basic Algebra'],
    gradeLevel: 'Grade 11 - University',
    reviews: [],
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    code: 'PHYS-202',
    slug: 'quantum-physics-modern-wave-mechanics',
    title: 'Quantum Physics: Modern Wave Mechanics',
    description: 'Delve into the subatomic world with Wave Functions, Heisenberg Uncertainty Principle.',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    longDescription: 'Delve into the subatomic world.',
    instructorId: 't2222222-2222-4222-8222-222222222222',
    instructorName: 'Dr. Arthur Feynman',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    progress: 0,
    category: 'Science',
    status: 'ACTIVE',
    credits: 4,
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewsCount: 88,
    studentsCount: 850,
    requirements: ['Calculus I'],
    gradeLevel: 'Grade 12 - University',
    reviews: [],
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    code: 'CS-301',
    slug: 'systems-architecture-operating-systems',
    title: 'Systems Architecture & Operating Systems',
    description: 'Explore modern Operating Systems: kernel design, process scheduling, concurrency.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    longDescription: 'Explore modern Operating Systems.',
    instructorId: 't3333333-3333-4333-8333-333333333333',
    instructorName: 'Prof. Linus Torvalds',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    progress: 0,
    category: 'Technology',
    status: 'ACTIVE',
    credits: 4,
    price: 0,
    rating: 5.0,
    reviewsCount: 210,
    studentsCount: 2100,
    requirements: ['C Programming'],
    gradeLevel: 'University Level',
    reviews: [],
  },
];

class CoursesRepository extends BaseRepository {
  async getAll(): Promise<Course[]> {
    try {
      const response = await api.get<any>('/public/courses');
      if (response && response.data?.items && response.data.items.length > 0) {
        return response.data.items;
      }
      return FALLBACK_COURSES;
    } catch (error) {
      this.handleError('getAllCourses', error);
      return FALLBACK_COURSES;
    }
  }

  async getBySlug(slug: string): Promise<Course | null> {
    try {
      const response = await api.get<any>(`/public/courses/${slug}`);
      if (response && response.data) {
        return response.data;
      }
      return FALLBACK_COURSES.find(c => c.slug === slug || c.code === slug || c.id === slug) || FALLBACK_COURSES[0];
    } catch (error) {
      this.handleError(`getCourseBySlug(${slug})`, error);
      return FALLBACK_COURSES.find(c => c.slug === slug || c.code === slug || c.id === slug) || FALLBACK_COURSES[0];
    }
  }

  async getFeatured(): Promise<Course[]> {
    const courses = await this.getAll();
    return courses.slice(0, 3);
  }
}

export const coursesRepository = new CoursesRepository();
export default coursesRepository;
