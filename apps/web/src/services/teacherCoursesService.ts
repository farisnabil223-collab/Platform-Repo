import api from './api';
import { saveStoredCustomCourse, getStoredCustomCourses, Course } from '../repositories/CoursesRepository';

const SUBJECT_IMAGES: Record<string, string> = {
  'الرياضيات': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
  'Mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
  'الفيزياء': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
  'Physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
  'Science': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
  'الكيمياء': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
  'Chemistry': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
  'Technology': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  'تكنولوجيا المعلومات': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
};

function getSubjectImage(subject: string = ''): string {
  for (const [key, url] of Object.entries(SUBJECT_IMAGES)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80';
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `course-${Date.now()}`;
}

export const teacherCoursesService = {
  getCourses: async () => {
    const custom = getStoredCustomCourses();
    try {
      const res = await api.get<any>('/courses');
      if (res.data?.items && res.data.items.length > 0) {
        const combined = [...custom, ...res.data.items];
        const unique = new Map();
        combined.forEach(c => unique.set(c.id, c));
        return Array.from(unique.values());
      }
    } catch (err) {
      // API fallback
    }
    return custom;
  },

  getCourseById: async (id: string) => {
    const custom = getStoredCustomCourses();
    const found = custom.find(c => c.id === id);
    if (found) return found;

    try {
      const res = await api.get<any>(`/courses/${id}`);
      return res.data || null;
    } catch (err) {
      return null;
    }
  },

  createCourse: async (data: any) => {
    const courseSlug = data.slug || generateSlug(data.title || data.code || 'course');
    const newCourse: Course = {
      id: data.id || `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      code: data.code || 'CRS-100',
      slug: courseSlug,
      title: data.title,
      description: data.description || 'كورس تعليمي جديد متاح للتسجيل والاشتراك للطلاب.',
      longDescription: data.longDescription || data.description || 'كورس تعليمي جديد متاح للتسجيل والاشتراك للطلاب.',
      image: data.image || getSubjectImage(data.subject || data.category),
      instructorId: data.instructorId || 't_current_teacher',
      instructorName: data.instructorName || 'د. مدرس المادة',
      instructorAvatar: data.instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      progress: 0,
      category: data.category || data.subject || 'الرياضيات',
      status: data.status || 'ACTIVE',
      credits: Number(data.credits) || 3,
      price: Number(data.price) || 0,
      originalPrice: Number(data.originalPrice) || (Number(data.price) > 0 ? Math.round(Number(data.price) * 1.3) : 0),
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      requirements: data.requirements || ['الالتزام بالحضور والمتابعة الدوريّة'],
      gradeLevel: data.gradeLevel || 'جامعي / ثانوي',
      reviews: [],
      lessons: data.lessons || [
        { id: 'l1', title: 'الدرس الأول - مقدمة التمهيد والأساسيات', duration: '45 mins', preview: true },
        { id: 'l2', title: 'الدرس الثاني - الشرح التطبيقي والتدريبات', duration: '60 mins', preview: false },
      ],
    };

    saveStoredCustomCourse(newCourse);

    try {
      const res = await api.post<any>('/courses', data);
      if (res && res.data) {
        return res.data;
      }
    } catch (err) {
      // Graceful fallback to saved local custom course
    }

    return newCourse;
  },

  updateCourse: async (id: string, data: any) => {
    try {
      const res = await api.put<any>(`/courses/${id}`, data);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  deleteCourse: async (id: string) => {
    try {
      const res = await api.delete<any>(`/courses/${id}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  archiveCourse: async (id: string) => {
    try {
      const res = await api.post<any>(`/courses/${id}/archive`, {});
      return res.data;
    } catch (err) {
      return null;
    }
  },
};

