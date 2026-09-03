/* eslint-disable no-undef */
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
    title: 'الرياضيات والتفاضل والتكامل',
    description: 'أساسيات ومفاهيم التفاضل والتكامل والتطبيقات العملية.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    longDescription: 'دورة شاملة في مبادئ التفاضل والتكامل.',
    instructorId: 't5555555-5555-4555-8555-555555555555',
    instructorName: 'د. سارة أحمد',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    progress: 0,
    category: 'الرياضيات',
    status: 'ACTIVE',
    credits: 3,
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.9,
    reviewsCount: 145,
    studentsCount: 1420,
    requirements: ['مبادئ الجبر'],
    gradeLevel: 'الثانوية العامة - الجامعات',
    reviews: [],
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    code: 'PHYS-202',
    slug: 'quantum-physics-modern-wave-mechanics',
    title: 'الفيزياء الحديثة والكهربية',
    description: 'شرح الفيزياء الحديثة والميكانيكا والكهربية المتقدمة.',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    longDescription: 'كورس متكامل في مبادئ الفيزياء والتطبيقات العملية.',
    instructorId: 't4444444-4444-4444-8444-444444444444',
    instructorName: 'د. طارق علي',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    progress: 0,
    category: 'العلوم والفيزياء',
    status: 'ACTIVE',
    credits: 4,
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewsCount: 88,
    studentsCount: 850,
    requirements: ['الرياضيات العامة'],
    gradeLevel: 'الثانوية العامة - الجامعات',
    reviews: [],
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    code: 'CS-301',
    slug: 'systems-architecture-operating-systems',
    title: 'أساسيات البرمجة ونظم التشغيل',
    description: 'شرح هندسة الحاسب ونظم التشغيل والبرمجة باللغات الحديثة.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    longDescription: 'دورة تفاعلية لبناء البرمجيات وفهم نظم التشغيل.',
    instructorId: 't6666666-6666-4666-8666-666666666666',
    instructorName: 'أ. محمد عبد الله',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    progress: 0,
    category: 'تكنولوجيا المعلومات',
    status: 'ACTIVE',
    credits: 4,
    price: 0,
    rating: 5.0,
    reviewsCount: 210,
    studentsCount: 2100,
    requirements: ['أساسيات الحاسب'],
    gradeLevel: 'المستوى المتقدم',
    reviews: [],
  },
];

const CUSTOM_COURSES_KEY = 'eduverse_custom_courses';

export function getStoredCustomCourses(): Course[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_COURSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCustomCourse(course: Course): Course {
  if (typeof window === 'undefined') return course;
  try {
    const existing = getStoredCustomCourses();
    const updated = [course, ...existing.filter((c) => c.id !== course.id && c.slug !== course.slug)];
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('eduverse-courses-updated'));
    return course;
  } catch (e) {
    return course;
  }
}

class CoursesRepository extends BaseRepository {
  async getAll(): Promise<Course[]> {
    const customCourses = getStoredCustomCourses();
    try {
      const response = await api.get<any>('/public/courses');
      if (response && response.data?.items && response.data.items.length > 0) {
        const combined = [...customCourses, ...response.data.items];
        const uniqueMap = new Map();
        combined.forEach(c => uniqueMap.set(c.id || c.slug, c));
        return Array.from(uniqueMap.values());
      }
    } catch (error) {
      this.handleError('getAllCourses', error);
    }

    const combined = [...customCourses, ...FALLBACK_COURSES];
    const uniqueMap = new Map();
    combined.forEach(c => uniqueMap.set(c.id || c.slug, c));
    return Array.from(uniqueMap.values());
  }

  async getBySlug(slug: string): Promise<Course | null> {
    const allCourses = await this.getAll();
    const found = allCourses.find(c => c.slug === slug || c.code === slug || c.id === slug);
    if (found) return found;

    try {
      const response = await api.get<any>(`/public/courses/${slug}`);
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      this.handleError(`getCourseBySlug(${slug})`, error);
    }

    return FALLBACK_COURSES.find(c => c.slug === slug || c.code === slug || c.id === slug) || FALLBACK_COURSES[0];
  }

  async getFeatured(): Promise<Course[]> {
    const courses = await this.getAll();
    return courses.slice(0, 3);
  }

  saveCourse(course: Course): Course {
    return saveStoredCustomCourse(course);
  }
}

export const coursesRepository = new CoursesRepository();
export default coursesRepository;

