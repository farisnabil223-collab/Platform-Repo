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
  const list: Teacher[] = [];
  try {
    const raw = localStorage.getItem(CUSTOM_TEACHERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list.push(...parsed);
    }
  } catch (e) {
    // Ignore fallback errors
  }

  try {
    const adminRaw = localStorage.getItem('eduverse_admin_users');
    if (adminRaw) {
      const adminUsers = JSON.parse(adminRaw);
      if (Array.isArray(adminUsers)) {
        adminUsers.forEach((u: any) => {
          if (u.role === 'TEACHER' && u.name && !list.some(t => t.id === u.id || t.email === u.email)) {
            const slug = u.slug || u.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') || `tch-${u.id}`;
            list.push({
              id: u.id || `t_${Date.now()}`,
              slug,
              name: u.name,
              email: u.email,
              avatar: u.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
              bio: u.bio || `مدرس مادة ${u.subject || 'الأكاديمية'} المعين من الإدارة العليا.`,
              detailedBio: u.detailedBio || `استشاري ومدرس مادة ${u.subject || 'الأكاديمية'} المعين رسمياً من إدارة المنصة لإلقاء الشروحات وتصحيح الاختبارات والواجبات المنهجية.`,
              specialties: u.specialties || [u.subject || 'المادة الأكاديمية'],
              qualifications: u.qualifications || [`بكالوريوس وتخصص ${u.subject || 'الأكاديمي'}`],
              certificates: u.certificates || ['شهادة اعتماد التدريس الرقمي من المنصة'],
              experienceYears: u.experienceYears || 8,
              rating: u.rating || 5.0,
              reviewsCount: u.reviewsCount || 0,
              studentsCount: u.studentsCount || 0,
              verifiedBadge: true,
              subject: u.subject,
            });
          }
        });
      }
    }
  } catch (e) {
    // Ignore fallback errors
  }

  return list;
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
    id: 't4444444-4444-4444-8444-444444444444',
    slug: 'tch-9935',
    name: 'د. طارق علي',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'مدرس واستشاري مادة الفيزياء التطبيقية والكهربية للثانوية العامة والجامعات.',
    detailedBio: 'خبير تدريس الفيزياء للثانوية العامة والجامعات مع خبرة أكثر من 10 سنوات في إعداد الاختبارات ونشر الشروحات.',
    specialties: ['الفيزياء', 'الميكانيكا', 'الكهربية'],
    qualifications: ['دكتوراة الفيزياء النظرية والفيزياء الكهربية', 'استشاري التعليم الأكاديمي'],
    certificates: ['شهادة معلم الفيزياء المعتمد من المنصة'],
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 112,
    studentsCount: 1280,
    verifiedBadge: true,
    subject: 'الفيزياء',
  },
  {
    id: 't5555555-5555-4555-8555-555555555555',
    slug: 'tch-9936',
    name: 'د. سارة أحمد',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'مدرسة مادة الرياضيات العامة والهندسة الفراغية.',
    detailedBio: 'استشارية تدريس الرياضيات والتفاضل والتكامل والهندسة الفراغية مع تقديم التطبيقات العملية للطلاب.',
    specialties: ['الرياضيات', 'التفاضل والتكامل', 'الهندسة'],
    qualifications: ['دكتوراة الرياضيات التطبيقية', 'ماجستير الجبر والهندسة'],
    certificates: ['وسام التميز في التدريس الرقمي'],
    experienceYears: 9,
    rating: 4.9,
    reviewsCount: 95,
    studentsCount: 1100,
    verifiedBadge: true,
    subject: 'الرياضيات',
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

