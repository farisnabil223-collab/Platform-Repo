/* eslint-disable no-undef */
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
  qualifications?: string[] | string;
  certificates?: string[];
  experienceYears?: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  verifiedBadge?: boolean;
  socials?: { twitter?: string; linkedin?: string; github?: string };
  socialLinks?: { twitter?: string; linkedin?: string; github?: string };
  courses?: any[];
  subject?: string;
  email?: string;
}

const CUSTOM_TEACHERS_KEY = 'eduverse_custom_teachers';

export function getStoredCustomTeachers(): Teacher[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_TEACHERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCustomTeacher(teacher: Teacher): Teacher {
  if (typeof window === 'undefined') return teacher;
  try {
    const existing = getStoredCustomTeachers();
    const updated = [teacher, ...existing.filter((t) => t.id !== teacher.id && t.slug !== teacher.slug)];
    localStorage.setItem(CUSTOM_TEACHERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('eduverse-teachers-updated'));
    return teacher;
  } catch (e) {
    return teacher;
  }
}

const FALLBACK_TEACHERS: Teacher[] = [
  {
    id: 't1111111-1111-4111-8111-111111111111',
    slug: 'tch-9932',
    name: 'Dr. Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Professor of Mathematics and Quantum Computation.',
    detailedBio: 'Professor of Mathematics and Quantum Computation with over 12 years of research and teaching excellence in top tier universities.',
    specialties: ['Mathematics', 'Calculus'],
    qualifications: ['Ph.D. in Applied Mathematics, Stanford University', 'M.Sc. in Mathematical Physics'],
    certificates: ['Excellence in University Teaching Award', 'Advanced Calculus Educator Certification'],
    socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com', github: 'https://github.com' },
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
    detailedBio: 'Lead Researcher in Quantum Electrodynamics and Theoretical Physics, specializing in atomic structure and wave mechanics.',
    specialties: ['Physics', 'Quantum Mechanics'],
    qualifications: ['Ph.D. in Theoretical Physics, Caltech', 'B.Sc. in Physics & Quantum Electronics'],
    certificates: ['Quantum Physics Leadership Award', 'International Theoretical Mechanics Fellow'],
    socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
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
    detailedBio: 'Veteran Systems Architect and Kernel Engineer. Author of pioneering low-level software and distributed version control systems.',
    specialties: ['Computer Science', 'Operating Systems'],
    qualifications: ['M.Sc. in Computer Science, University of Helsinki', 'Honorary Doctorate in Systems Engineering'],
    certificates: ['IEEE Computer Pioneer Award', 'Millennium Technology Prize'],
    socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    experienceYears: 20,
    rating: 5.0,
    reviewsCount: 210,
    studentsCount: 2100,
    verifiedBadge: true,
  },
];

class TeachersRepository extends BaseRepository {
  async getAll(): Promise<Teacher[]> {
    const custom = getStoredCustomTeachers();
    try {
      const response = await api.get<any>('/public/teachers');
      if (response && response.data?.items && response.data.items.length > 0) {
        const combined = [...custom, ...response.data.items];
        const uniqueMap = new Map();
        combined.forEach(t => uniqueMap.set(t.id || t.slug, t));
        return Array.from(uniqueMap.values());
      }
    } catch (error) {
      this.handleError('getAllTeachers', error);
    }

    const combined = [...custom, ...FALLBACK_TEACHERS];
    const uniqueMap = new Map();
    combined.forEach(t => uniqueMap.set(t.id || t.slug, t));
    return Array.from(uniqueMap.values());
  }

  async getBySlug(slug: string): Promise<Teacher | null> {
    const allTeachers = await this.getAll();
    const found = allTeachers.find(
      (t) =>
        t.slug === slug ||
        t.id === slug ||
        (t.name && t.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()) ||
        (t.email && t.email.toLowerCase() === slug.toLowerCase())
    );
    if (found) return found;

    try {
      const response = await api.get<any>(`/public/teachers/${slug}`);
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      this.handleError(`getTeacherBySlug(${slug})`, error);
    }

    return FALLBACK_TEACHERS.find(t => t.slug === slug || t.id === slug) || FALLBACK_TEACHERS[0];
  }

  saveTeacher(teacher: Teacher): Teacher {
    return saveStoredCustomTeacher(teacher);
  }
}

export const teachersRepository = new TeachersRepository();
export default teachersRepository;

