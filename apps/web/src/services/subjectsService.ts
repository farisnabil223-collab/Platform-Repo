/* eslint-disable no-undef */
import api from './api';

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  gradeLevel: string;
  category: string;
  creditHours: number;
  weeklyHours: number;
  iconName?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt?: string;
}

const STORAGE_KEY_SUBJECTS = 'eduverse_platform_subjects_v1';
const STORAGE_KEY_TEACHER_SUBJECTS = 'eduverse_teacher_allowed_subjects_v1';

const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'subj-math',
    code: 'MATH',
    name: 'الرياضيات',
    slug: 'mathematics',
    description: 'من أساسيات الجبر والهندسة حتى التفاضل والتكامل وحساب المثلثات المتقدم.',
    gradeLevel: 'الصف الثالث الثانوي - جامعـي',
    category: 'Mathematics',
    creditHours: 4,
    weeklyHours: 5,
    iconName: 'calculator',
    status: 'ACTIVE',
  },
  {
    id: 'subj-phys',
    code: 'PHYS',
    name: 'الفيزياء',
    slug: 'physics',
    description: 'الفيزياء الكهربية والمغناطيسية، والفيزياء الحديثة وميكانيكا الكم.',
    gradeLevel: 'الصف الثالث الثانوي',
    category: 'Science',
    creditHours: 4,
    weeklyHours: 4,
    iconName: 'zap',
    status: 'ACTIVE',
  },
  {
    id: 'subj-chem',
    code: 'CHEM',
    name: 'الكيمياء',
    slug: 'chemistry',
    description: 'الكيمياء العضوية، الكيمياء التحليلية، والحرارية والتفاعلات الكيميائية.',
    gradeLevel: 'الصف الثاني الثانوي',
    category: 'Science',
    creditHours: 3,
    weeklyHours: 3,
    iconName: 'flask',
    status: 'ACTIVE',
  },
  {
    id: 'subj-cs',
    code: 'CS',
    name: 'علوم الحاسب والبرمجة',
    slug: 'computer-science',
    description: 'أساسيات برمجة الحاسب، خوارزميات، وهياكل البيانات وتصميم المواقع.',
    gradeLevel: 'جميع المراحل الدراسية',
    category: 'Technology',
    creditHours: 4,
    weeklyHours: 4,
    iconName: 'code',
    status: 'ACTIVE',
  },
  {
    id: 'subj-eng',
    code: 'ENG',
    name: 'اللغة الإنجليزية',
    slug: 'english',
    description: 'قواعد اللغة الإنجليزية Grammar، المهارات، مهارات الكتابة والترجمة.',
    gradeLevel: 'جميع المراحل الدراسية',
    category: 'Languages',
    creditHours: 3,
    weeklyHours: 3,
    iconName: 'globe',
    status: 'ACTIVE',
  },
];

export const subjectsService = {
  getSubjects: async (): Promise<SubjectItem[]> => {
    try {
      const res = await api.get<any>('/public/subjects');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      // Ignore API failure, fallback to localStorage/mock
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SUBJECTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }

    return INITIAL_SUBJECTS;
  },

  createSubject: async (subjectData: Partial<SubjectItem>): Promise<SubjectItem> => {
    const slug = subjectData.slug || subjectData.code?.toLowerCase() || Math.random().toString(36).substring(7);
    const newSubject: SubjectItem = {
      id: `subj-${Date.now()}`,
      code: (subjectData.code || 'SUBJ').toUpperCase(),
      name: subjectData.name || 'مادة جديدة',
      slug,
      description: subjectData.description || 'وصف المادة الدراسية والمنهج.',
      gradeLevel: subjectData.gradeLevel || 'جميع المراحل',
      category: subjectData.category || 'General',
      creditHours: Number(subjectData.creditHours) || 3,
      weeklyHours: Number(subjectData.weeklyHours) || 3,
      iconName: subjectData.iconName || 'book',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post('/public/subjects', newSubject);
    } catch (err) {
      // Local fallback
    }

    if (typeof window !== 'undefined') {
      const current = await subjectsService.getSubjects();
      const updated = [newSubject, ...current];
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(updated));
    }

    return newSubject;
  },

  getTeacherAllowedSubjects: (teacherEmail: string): string[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_TEACHER_SUBJECTS);
      if (saved) {
        try {
          const map = JSON.parse(saved);
          if (map[teacherEmail]) return map[teacherEmail];
        } catch (e) {
          // ignore
        }
      }
    }
    return ['الرياضيات', 'الفيزياء', 'الكيمياء', 'علوم الحاسب والبرمجة', 'اللغة الإنجليزية'];
  },

  setTeacherAllowedSubjects: (teacherEmail: string, allowedSubjects: string[]) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_TEACHER_SUBJECTS);
      let map: Record<string, string[]> = {};
      if (saved) {
        try {
          map = JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
      map[teacherEmail] = allowedSubjects;
      localStorage.setItem(STORAGE_KEY_TEACHER_SUBJECTS, JSON.stringify(map));
    }
  },
};

export default subjectsService;
