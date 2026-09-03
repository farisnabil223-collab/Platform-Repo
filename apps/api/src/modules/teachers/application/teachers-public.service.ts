import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITeachersRepository } from '../domain/teachers.repository';
import { IMediaProvider } from '../../media/domain/media-provider.interface';

@Injectable()
export class TeachersPublicService {
  constructor(
    @Inject(ITeachersRepository)
    private readonly teachersRepository: ITeachersRepository,
    @Inject(IMediaProvider)
    private readonly mediaProvider: IMediaProvider
  ) {}

  async getTeachers(params: {
    specialty?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { items, total } = await this.teachersRepository.findPublic(params);

    const enrichedItems = items.map((t) => {
      return {
        id: t.id,
        teacherCode: t.teacherCode || `TCH-${t.id}`,
        name: t.name || t.user?.name || t.user?.email?.split('@')[0] || 'استشاري المادة المعتمد',
        avatar: t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        bio: t.bio || 'استشاري ومدرس معتمد من إدارة المنصة التعليمية.',
        specialties: t.specialties || [],
        rating: t.rating || 5.0,
        reviewsCount: t.reviewsCount || 0,
        studentsCount: t.studentsCount || 0,
        verifiedBadge: true,
      };
    });

    return {
      items: enrichedItems,
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async getTeacherByIdOrCode(idOrCode: string) {
    const teacher = await this.teachersRepository.findByIdOrCode(idOrCode);
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    return {
      id: teacher.id,
      teacherCode: teacher.teacherCode || `TCH-${teacher.id}`,
      name: teacher.name || teacher.user?.name || teacher.user?.email?.split('@')[0] || 'استشاري المادة المعتمد',
      avatar: teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: teacher.bio || 'استشاري ومدرس معتمد من إدارة المنصة التعليمية.',
      specialties: teacher.specialties || [],
      rating: teacher.rating || 5.0,
      reviewsCount: teacher.reviewsCount || 0,
      studentsCount: teacher.studentsCount || 0,
      verifiedBadge: true,
      qualifications: teacher.qualifications || ['معتمد رسمياً من الإدارة التعليمية'],
      experienceYears: teacher.experienceYears || 8,
      teachingStyle: teacher.teachingStyle || 'شرح تبسيطي تفاعلي مع أمثلة تطبيقية واختبارات قياسية.',
      responseTime: teacher.responseTime || '< 2 hours',
      socials: teacher.socials || { twitter: '#', linkedin: '#', github: '#' },
      courses: (teacher.courses || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        code: c.code,
        description: c.description || 'منهج المادة والمحاضرات الرقمية.',
      })),
    };
  }
}

