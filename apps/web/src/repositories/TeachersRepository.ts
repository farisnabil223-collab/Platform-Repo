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
const ADMIN_USERS_KEY = 'eduverse_admin_users';
const COOKIE_NAME = 'eduverse_custom_teachers_cookie';

export function getStoredCustomTeachers(): Teacher[] {
  if (typeof window === 'undefined') return [];
  const list: Teacher[] = [];

  const addUnique = (t: any) => {
    if (!t || !t.name) return;
    // Filter out fake legacy mock names
    const isFakeMock = ['dr. emily watson', 'dr. arthur feynman', 'prof. linus torvalds'].includes((t.name || '').toLowerCase());
    if (isFakeMock) return;

    if (!list.some(existing => existing.id === t.id || (existing.email && t.email && existing.email === t.email) || existing.slug === t.slug)) {
      const slug = t.slug || t.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') || `tch-${t.id || Date.now()}`;
      list.push({
        id: t.id || `t_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        slug,
        name: t.name,
        email: t.email,
        avatar: t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        bio: t.bio || `مدرس واستشاري مادة ${t.subject || 'الأكاديمية'} المعين من الإدارة العليا.`,
        detailedBio: t.detailedBio || t.bio || `استشاري ومدرس مادة ${t.subject || 'الأكاديمية'} المعين رسمياً من إدارة المنصة لإلقاء الشروحات وتصحيح الاختبارات والواجبات المنهجية.`,
        specialties: t.specialties || [t.subject || 'المادة الأكاديمية'],
        qualifications: t.qualifications || [`بكالوريوس وتخصص ${t.subject || 'الأكاديمي'}`],
        certificates: t.certificates || ['شهادة اعتماد التدريس الرقمي من المنصة'],
        experienceYears: t.experienceYears || 8,
        rating: t.rating || 5.0,
        reviewsCount: t.reviewsCount || 0,
        studentsCount: t.studentsCount || 0,
        verifiedBadge: true,
        subject: t.subject,
      });
    }
  };

  // 1. Read from localStorage custom key
  try {
    const raw = localStorage.getItem(CUSTOM_TEACHERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) parsed.forEach(addUnique);
    }
  } catch (e) {
    // Ignore fallback
  }

  // 2. Read from localStorage admin users key
  try {
    const adminRaw = localStorage.getItem(ADMIN_USERS_KEY);
    if (adminRaw) {
      const adminUsers = JSON.parse(adminRaw);
      if (Array.isArray(adminUsers)) {
        adminUsers.forEach((u: any) => {
          if (u.role === 'TEACHER') addUnique(u);
        });
      }
    }
  } catch (e) {
    // Ignore fallback
  }

  // 3. Read from Cookie (Cross-origin/subdomain sync fallback)
  try {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [name, val] = c.trim().split('=');
      if (name === COOKIE_NAME && val) {
        const decoded = JSON.parse(decodeURIComponent(val));
        if (Array.isArray(decoded)) decoded.forEach(addUnique);
      }
    }
  } catch (e) {
    // Ignore fallback
  }

  return list;
}

export function saveStoredCustomTeacher(teacher: Teacher): Teacher {
  if (typeof window === 'undefined') return teacher;
  try {
    const existing = getStoredCustomTeachers();
    const updated = [teacher, ...existing.filter((t) => t.id !== teacher.id && t.slug !== teacher.slug)];

    // 1. Save to LocalStorage
    localStorage.setItem(CUSTOM_TEACHERS_KEY, JSON.stringify(updated));

    // Also sync admin users list if exists
    try {
      const adminRaw = localStorage.getItem(ADMIN_USERS_KEY);
      let adminUsers: any[] = adminRaw ? JSON.parse(adminRaw) : [];
      if (!Array.isArray(adminUsers)) adminUsers = [];
      const newAdminUser = {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email || `${teacher.slug}@eduverse.com`,
        role: 'TEACHER',
        subject: teacher.subject || teacher.specialties[0] || 'الرياضيات',
        status: 'ACTIVE',
        bio: teacher.bio,
        avatar: teacher.avatar,
      };
      const filteredAdminUsers = adminUsers.filter((u: any) => u.id !== teacher.id && u.email !== teacher.email);
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([newAdminUser, ...filteredAdminUsers]));
    } catch (e) {
      // Ignore fallback
    }

    // 2. Save to Cookie for cross-domain/path sync
    try {
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      // Ignore fallback
    }

    // 3. Broadcast Event to current window and BroadcastChannel
    window.dispatchEvent(new Event('eduverse-teachers-updated'));
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('eduverse-teachers-sync');
      channel.postMessage({ type: 'TEACHER_ADDED', teacher });
      channel.close();
    }

    // 4. Send API POST to backend asynchronously
    api.post('/public/teachers', teacher).catch(() => {
      api.post('/teachers', teacher).catch(() => {});
    });

    return teacher;
  } catch (e) {
    return teacher;
  }
}

const DEFAULT_REAL_TEACHERS: Teacher[] = [
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
    bio: 'مدرسة واستشارية مادة الرياضيات العامة والهندسة الفراغية.',
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
    let apiItems: Teacher[] = [];

    try {
      const response = await api.get<any>('/public/teachers');
      if (response && response.data?.items && Array.isArray(response.data.items)) {
        apiItems = response.data.items.filter((t: any) => {
          const isFakeMock = ['dr. emily watson', 'dr. arthur feynman', 'prof. linus torvalds'].includes((t.name || '').toLowerCase());
          return !isFakeMock;
        });
      }
    } catch (error) {
      this.handleError('getAllTeachers', error);
    }

    const combined = [...custom, ...apiItems, ...DEFAULT_REAL_TEACHERS];
    const uniqueMap = new Map();
    combined.forEach((t) => {
      const key = t.id || t.slug;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, t);
      }
    });

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

    return DEFAULT_REAL_TEACHERS.find(t => t.slug === slug || t.id === slug) || DEFAULT_REAL_TEACHERS[0];
  }

  saveTeacher(teacher: Teacher): Teacher {
    return saveStoredCustomTeacher(teacher);
  }
}

export const teachersRepository = new TeachersRepository();
export default teachersRepository;


