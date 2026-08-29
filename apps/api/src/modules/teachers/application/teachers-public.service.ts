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

  private mapTeacherMetadata(code: string) {
    const meta: Record<string, any> = {
      'TCH-9932': {
        name: 'Dr. Emily Watson',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 145,
        studentsCount: 1420,
        qualifications: 'Ph.D. in Applied Mathematics from MIT',
        experienceYears: 12,
        teachingStyle: 'Interactive problem-solving with geometric visualizations.',
        responseTime: '< 2 hours',
        verifiedBadge: true,
        socials: { twitter: '#', linkedin: '#', github: '#' },
      },
      'TCH-9933': {
        name: 'Dr. Arthur Feynman',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviewsCount: 88,
        studentsCount: 850,
        qualifications: 'Ph.D. in Theoretical Physics from Caltech',
        experienceYears: 15,
        teachingStyle: 'First-principles conceptual derivation and quantum physics analogies.',
        responseTime: '< 4 hours',
        verifiedBadge: true,
        socials: { twitter: '#', linkedin: '#', github: '#' },
      },
      'TCH-9934': {
        name: 'Prof. Linus Torvalds',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        rating: 5.0,
        reviewsCount: 210,
        studentsCount: 2100,
        qualifications: 'M.S. in Computer Science from University of Helsinki',
        experienceYears: 20,
        teachingStyle: 'Hands-on kernel hacking and bare-metal code inspections.',
        responseTime: '< 1 hour',
        verifiedBadge: true,
        socials: { twitter: '#', linkedin: '#', github: '#' },
      },
    };
    return meta[code] || {
      name: 'Faculty Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      rating: 4.5,
      reviewsCount: 10,
      studentsCount: 100,
      qualifications: 'Certified Academic Instructor',
      experienceYears: 5,
      teachingStyle: 'Structured curriculum guidelines.',
      responseTime: '< 12 hours',
      verifiedBadge: false,
      socials: { twitter: '#', linkedin: '#', github: '#' },
    };
  }

  async getTeachers(params: {
    specialty?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { items, total } = await this.teachersRepository.findPublic(params);

    const enrichedItems = items.map((t) => {
      const metadata = this.mapTeacherMetadata(t.teacherCode);
      return {
        id: t.id,
        teacherCode: t.teacherCode,
        name: metadata.name,
        avatar: metadata.avatar,
        bio: t.bio || 'EduVerse Faculty Instructor.',
        specialties: t.specialties || [],
        rating: metadata.rating,
        reviewsCount: metadata.reviewsCount,
        studentsCount: metadata.studentsCount,
        verifiedBadge: metadata.verifiedBadge,
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

    const metadata = this.mapTeacherMetadata(teacher.teacherCode);
    return {
      id: teacher.id,
      teacherCode: teacher.teacherCode,
      name: metadata.name,
      avatar: metadata.avatar,
      bio: teacher.bio || 'EduVerse Faculty Instructor.',
      specialties: teacher.specialties || [],
      rating: metadata.rating,
      reviewsCount: metadata.reviewsCount,
      studentsCount: metadata.studentsCount,
      verifiedBadge: metadata.verifiedBadge,
      qualifications: metadata.qualifications,
      experienceYears: metadata.experienceYears,
      teachingStyle: metadata.teachingStyle,
      responseTime: metadata.responseTime,
      socials: metadata.socials,
      courses: (teacher.courses || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        code: c.code,
        description: c.description || 'Course program syllabus.',
      })),
    };
  }
}
