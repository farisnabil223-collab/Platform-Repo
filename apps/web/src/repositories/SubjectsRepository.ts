import { BaseRepository } from './BaseRepository';
import api from '../services/api';

export interface Subject {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName?: string;
  grades?: string[];
  creditHours?: number;
  weeklyHours?: number;
}

const FALLBACK_SUBJECTS: Subject[] = [
  { id: 'subj-1', slug: 'math-subj', name: 'Mathematics', description: 'From foundational algebra to advanced differential calculus.', iconName: 'courses', grades: ['University'], creditHours: 3 },
  { id: 'subj-2', slug: 'phys-subj', name: 'Science', description: 'Quantum wave mechanics, astrophysics, and chemistry.', iconName: 'activity', grades: ['Grade 12'], creditHours: 4 },
  { id: 'subj-3', slug: 'tech-subj', name: 'Technology', description: 'Operating systems, algorithms, and software engineering.', iconName: 'dashboard', grades: ['University'], creditHours: 4 },
  { id: 'subj-4', slug: 'hum-subj', name: 'Humanities', description: 'Literature, philosophy, and history outlines.', iconName: 'book', grades: ['Grade 12'], creditHours: 2 },
];

class SubjectsRepository extends BaseRepository {
  async getAll(): Promise<Subject[]> {
    try {
      const response = await api.get<any>('/public/subjects');
      const apiItems = response.data || [];
      if (Array.isArray(apiItems) && apiItems.length > 0) {
        return apiItems.map((subj: any) => ({
          id: subj.id,
          slug: subj.code?.toLowerCase() || subj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: subj.name,
          description: subj.description || 'Subject learning syllabus.',
          iconName: subj.code === 'MATH-SUBJ' ? 'courses' : subj.code === 'PHYS-SUBJ' ? 'activity' : subj.code === 'TECH-SUBJ' ? 'dashboard' : 'book',
          grades: subj.grade?.level ? [subj.grade.level] : ['University'],
          creditHours: subj.creditHours,
          weeklyHours: subj.weeklyHours,
        }));
      }
      return FALLBACK_SUBJECTS;
    } catch (error) {
      this.handleError('getAllSubjects', error);
      return FALLBACK_SUBJECTS;
    }
  }

  async getBySlug(slug: string): Promise<Subject | null> {
    const subjects = await this.getAll();
    return subjects.find((s) => s.slug === slug || s.id === slug) || null;
  }
}

export const subjectsRepository = new SubjectsRepository();
export default subjectsRepository;
