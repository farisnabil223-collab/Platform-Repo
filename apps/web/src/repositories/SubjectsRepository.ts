import { BaseRepository } from './BaseRepository';
import { subjectsService } from '../services/subjectsService';

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

class SubjectsRepository extends BaseRepository {
  async getAll(): Promise<Subject[]> {
    try {
      const platformSubjs = await subjectsService.getSubjects();
      if (platformSubjs && platformSubjs.length > 0) {
        return platformSubjs.map((subj) => ({
          id: subj.id,
          slug: subj.slug || subj.code.toLowerCase(),
          name: subj.name,
          description: subj.description || 'وصف ورؤية المنهج الدراسي.',
          iconName: subj.iconName || 'courses',
          grades: [subj.gradeLevel || 'جميع المراحل'],
          creditHours: subj.creditHours || 3,
          weeklyHours: subj.weeklyHours || 4,
        }));
      }
    } catch (error) {
      this.handleError('getAllSubjects', error);
    }
    return [];
  }

  async getBySlug(slug: string): Promise<Subject | null> {
    const subjects = await this.getAll();
    return subjects.find((s) => s.slug === slug || s.id === slug) || null;
  }
}

export const subjectsRepository = new SubjectsRepository();
export default subjectsRepository;
