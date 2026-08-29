import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { ISearchService } from '../domain/search.service.interface';

@Injectable()
export class PrismaSearchService implements ISearchService {
  async search(params: {
    query: string;
    type?: 'all' | 'courses' | 'teachers' | 'subjects';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    courses: { items: any[]; total: number };
    teachers: { items: any[]; total: number };
    subjects: { items: any[]; total: number };
  }> {
    const q = params.query || '';
    const type = params.type || 'all';
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const result = {
      courses: { items: [] as any[], total: 0 },
      teachers: { items: [] as any[], total: 0 },
      subjects: { items: [] as any[], total: 0 },
    };

    const courseWhere: any = {
      deletedAt: null,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
      ],
    };

    const teacherWhere: any = {
      deletedAt: null,
      OR: [
        { user: { email: { contains: q, mode: 'insensitive' } } },
        { bio: { contains: q, mode: 'insensitive' } },
        { specialties: { hasSome: [q] } },
      ],
    };

    const subjectWhere: any = {
      deletedAt: null,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
      ],
    };

    const promises: Promise<any>[] = [];

    if (type === 'all' || type === 'courses') {
      promises.push(
        prisma.course.findMany({
          where: courseWhere,
          skip,
          take: limit,
          include: {
            teacher: { include: { user: { select: { email: true, phone: true } } } },
          },
        }).then(items => { result.courses.items = items; }),
        prisma.course.count({ where: courseWhere }).then(count => { result.courses.total = count; })
      );
    }

    if (type === 'all' || type === 'teachers') {
      promises.push(
        prisma.teacher.findMany({
          where: teacherWhere,
          skip,
          take: limit,
          include: {
            user: { select: { email: true, phone: true } },
          },
        }).then(items => { result.teachers.items = items; }),
        prisma.teacher.count({ where: teacherWhere }).then(count => { result.teachers.total = count; })
      );
    }

    if (type === 'all' || type === 'subjects') {
      promises.push(
        prisma.subject.findMany({
          where: subjectWhere,
          skip,
          take: limit,
          include: { grade: true },
        }).then(items => { result.subjects.items = items; }),
        prisma.subject.count({ where: subjectWhere }).then(count => { result.subjects.total = count; })
      );
    }

    await Promise.all(promises);
    return result;
  }

  async autocomplete(query: string, type?: string): Promise<string[]> {
    // Return sample auto-completions based on database names matching the query
    const matches: string[] = [];
    if (!query) return [];

    const courses = await prisma.course.findMany({
      where: { title: { contains: query, mode: 'insensitive' }, deletedAt: null },
      take: 3,
      select: { title: true },
    });
    matches.push(...courses.map(c => c.title));

    const subjects = await prisma.subject.findMany({
      where: { name: { contains: query, mode: 'insensitive' }, deletedAt: null },
      take: 2,
      select: { name: true },
    });
    matches.push(...subjects.map(s => s.name));

    return Array.from(new Set(matches));
  }

  async getSuggestions(query: string): Promise<string[]> {
    return this.autocomplete(query);
  }

  async getRecentSearches(userId: string | null): Promise<string[]> {
    // Simple placeholder for future DB recent search table retrieval
    return ['Calculus', 'Quantum Mechanics', 'System Design'];
  }

  async getPopularSearches(): Promise<string[]> {
    return ['Software Engineering', 'Algebra', 'Astrophysics'];
  }

  async getTrendingSearches(): Promise<string[]> {
    return ['AI Technology', 'Quantum WAVE Mechanics', 'Next.js Routing'];
  }
}
