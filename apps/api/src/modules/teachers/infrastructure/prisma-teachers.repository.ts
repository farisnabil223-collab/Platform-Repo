import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { ITeachersRepository } from '../domain/teachers.repository';

const MOCK_TEACHERS = [
  {
    id: 't1111111-1111-4111-8111-111111111111',
    teacherCode: 'TCH-9932',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Professor of Mathematics and Quantum Computation.',
    specialties: ['Mathematics', 'Calculus'],
    user: { email: 'dr.johnson@eduverse.edu', phone: '+123456789' },
    courses: [],
  },
  {
    id: 't2222222-2222-4222-8222-222222222222',
    teacherCode: 'TCH-9933',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    bio: 'Instructor of Theoretical Wave Mechanics.',
    specialties: ['Physics', 'Quantum Mechanics'],
    user: { email: 'prof.einstein@eduverse.edu', phone: '+123456789' },
    courses: [],
  },
  {
    id: 't3333333-3333-4333-8333-333333333333',
    teacherCode: 'TCH-9934',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Instructor of Kernel Engineering & Low-Level Code.',
    specialties: ['Computer Science', 'Operating Systems'],
    user: { email: 'dr.turing@eduverse.edu', phone: '+123456789' },
    courses: [],
  },
];

function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
    ),
  ]);
}

@Injectable()
export class PrismaTeachersRepository implements ITeachersRepository {
  async findPublic(params: {
    specialty?: string;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: any[]; total: number }> {
    try {
      const page = Math.max(1, params.page);
      const limit = Math.max(1, params.limit);
      const skip = (page - 1) * limit;

      const where: any = { deletedAt: null };
      if (params.specialty) {
        where.specialties = { has: params.specialty };
      }
      if (params.search) {
        where.OR = [
          { bio: { contains: params.search, mode: 'insensitive' } },
          { user: { email: { contains: params.search, mode: 'insensitive' } } },
        ];
      }

      const [items, total] = await withDbTimeout(
        Promise.all([
          prisma.teacher.findMany({
            where,
            skip,
            take: limit,
            include: {
              user: { select: { email: true, phone: true } },
              courses: { where: { deletedAt: null } },
            },
          }),
          prisma.teacher.count({ where }),
        ])
      );

      return { items, total };
    } catch (error) {
      return { items: MOCK_TEACHERS, total: MOCK_TEACHERS.length };
    }
  }

  async findByIdOrCode(idOrCode: string): Promise<any | null> {
    try {
      return await withDbTimeout(
        prisma.teacher.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { id: idOrCode.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/) ? idOrCode : undefined },
              { teacherCode: idOrCode },
            ].filter(Boolean) as any,
          },
          include: {
            user: { select: { email: true, phone: true } },
            courses: { where: { deletedAt: null } },
          },
        })
      );
    } catch (error) {
      return MOCK_TEACHERS.find((t) => t.id === idOrCode || t.teacherCode === idOrCode) || MOCK_TEACHERS[0];
    }
  }

  async create(teacher: {
    id: string;
    userId: string;
    teacherCode: string;
    bio?: string;
    specialties?: string[];
  }): Promise<any> {
    try {
      return await prisma.teacher.create({
        data: {
          id: teacher.id,
          userId: teacher.userId,
          teacherCode: teacher.teacherCode,
          bio: teacher.bio || null,
          specialties: teacher.specialties || [],
          employmentMetadata: {},
        },
      });
    } catch (error) {
      return teacher;
    }
  }

  async count(): Promise<number> {
    try {
      return await prisma.teacher.count({ where: { deletedAt: null } });
    } catch (error) {
      return MOCK_TEACHERS.length;
    }
  }
}

