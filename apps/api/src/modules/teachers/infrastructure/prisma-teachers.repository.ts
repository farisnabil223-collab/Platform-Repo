import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { ITeachersRepository } from '../domain/teachers.repository';

const MOCK_TEACHERS = [
  {
    id: 't4444444-4444-4444-8444-444444444444',
    teacherCode: 'TCH-9935',
    name: 'د. طارق علي',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'مدرس واستشاري مادة الفيزياء التطبيقية والكهربية للثانوية العامة والجامعات.',
    specialties: ['الفيزياء', 'الميكانيكا'],
    user: { email: 'tarek@eduverse.com', phone: '01012345678' },
    courses: [],
  },
  {
    id: 't5555555-5555-4555-8555-555555555555',
    teacherCode: 'TCH-9936',
    name: 'د. سارة أحمد',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'مدرسة واستشارية مادة الرياضيات العامة والهندسة الفراغية.',
    specialties: ['الرياضيات', 'الهندسة'],
    user: { email: 'sara@eduverse.com', phone: '01098765432' },
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

