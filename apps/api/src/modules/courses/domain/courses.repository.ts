export interface ICoursesRepository {
  findPublic(params: {
    search?: string;
    teacherId?: string;
    page: number;
    limit: number;
  }): Promise<{ items: any[]; total: number }>;
  findBySlug(slug: string): Promise<any | null>;
  create(course: {
    id: string;
    code: string;
    slug: string;
    title: string;
    description?: string;
    teacherId: string;
    status?: string;
  }): Promise<any>;
  count(): Promise<number>;
}
export const ICoursesRepository = Symbol('ICoursesRepository');
