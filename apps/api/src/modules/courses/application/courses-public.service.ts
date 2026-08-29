import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICoursesRepository } from '../domain/courses.repository';
import { IMediaProvider } from '../../media/domain/media-provider.interface';
import { IReviewsRepository } from '../../catalog/domain/reviews.repository.interface';

@Injectable()
export class CoursesPublicService {
  constructor(
    @Inject(ICoursesRepository)
    private readonly coursesRepository: ICoursesRepository,
    @Inject(IMediaProvider)
    private readonly mediaProvider: IMediaProvider,
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository
  ) {}

  private mapCoursePrices(code: string) {
    if (code === 'MATH-101') return 49.99;
    if (code === 'PHYS-202') return 79.99;
    if (code === 'CS-301') return 0.00;
    return 29.99;
  }

  private mapCourseImage(code: string) {
    if (code.startsWith('MATH')) {
      return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80';
    }
    if (code.startsWith('PHYS')) {
      return 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
  }

  private mapInstructorAvatar(code: string) {
    if (code.startsWith('MATH')) {
      return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
    }
    if (code.startsWith('PHYS')) {
      return 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  }

  private mapCourseMetadata(code: string) {
    const meta: Record<string, any> = {
      'MATH-101': {
        category: 'Mathematics',
        studentsCount: 1420,
        rating: 4.9,
        requirements: ['Basic Algebra', 'High School Mathematics concepts'],
        longDescription: 'Master single-variable Calculus from the ground up. This course covers limits, derivatives, integration techniques, and real-world optimization problems.',
        gradeLevel: 'Grade 11 - University',
      },
      'PHYS-202': {
        category: 'Science',
        studentsCount: 850,
        rating: 4.8,
        requirements: ['Calculus I (Limits & Derivatives)', 'Classical Mechanics principles'],
        longDescription: 'Delve into the subatomic world with introduction to Wave Functions, Heisenberg Uncertainty Principle, Schrodinger Wave Equations, and Quantum Tunneling.',
        gradeLevel: 'Grade 12 - University',
      },
      'CS-301': {
        category: 'Technology',
        studentsCount: 2100,
        rating: 5.0,
        requirements: ['Basic programming in C/C++', 'Foundational computer hardware understanding'],
        longDescription: 'Explore the inner workings of modern Operating Systems: kernel design, process scheduling, concurrency management, virtual memory mapping, and file system structures.',
        gradeLevel: 'University Level',
      },
    };
    return meta[code] || {
      category: 'General Education',
      studentsCount: 120,
      rating: 4.5,
      requirements: [],
      longDescription: 'An education learning program provided by EduVerse.',
      gradeLevel: 'All Levels',
    };
  }

  async getCourses(params: {
    search?: string;
    teacherId?: string;
    page: number;
    limit: number;
  }) {
    const { items, total } = await this.coursesRepository.findPublic(params);

    const enrichedItems = await Promise.all(
      items.map(async (c) => {
        const metadata = this.mapCourseMetadata(c.code);
        const reviews = await this.reviewsRepository.findByCourseId(c.id);
        const reviewsCount = reviews.length;
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviewsCount > 0 ? Number((totalRating / reviewsCount).toFixed(1)) : metadata.rating;

        return {
          id: c.id,
          code: c.code,
          slug: c.slug,
          title: c.title,
          description: c.description,
          image: c.image || this.mapCourseImage(c.code),
          status: c.status === 'PUBLISHED' ? 'ACTIVE' : 'DRAFT',
          price: this.mapCoursePrices(c.code),
          instructorName: c.teacher?.user?.email ? c.teacher.user.email.split('@')[0] : 'Instructor',
          instructorAvatar: c.teacher?.avatar || this.mapInstructorAvatar(c.code),
          progress: 0,
          category: metadata.category,
          studentsCount: metadata.studentsCount,
          rating: averageRating,
          reviewsCount: reviewsCount > 0 ? reviewsCount : 15, // fallback count if seed is fresh
        };
      })
    );

    return {
      items: enrichedItems,
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async getCourseBySlug(slug: string) {
    const course = await this.coursesRepository.findBySlug(slug);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const metadata = this.mapCourseMetadata(course.code);
    const reviews = await this.reviewsRepository.findByCourseId(course.id);
    const reviewsCount = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviewsCount > 0 ? Number((totalRating / reviewsCount).toFixed(1)) : metadata.rating;

    // Format modules/lessons list
    const formattedModules = (course.modules || []).map((mod: any) => ({
      id: mod.id,
      title: mod.title,
      code: mod.code,
      lessons: (mod.lessons || []).map((les: any) => ({
        id: les.id,
        title: les.title,
        duration: '12 mins',
        preview: les.sortOrder <= 2, // First 2 lessons are free preview lectures
      })),
    }));

    return {
      id: course.id,
      code: course.code,
      slug: course.slug,
      title: course.title,
      description: course.description,
      image: course.image || this.mapCourseImage(course.code),
      longDescription: metadata.longDescription,
      instructorId: course.teacherId,
      instructorName: course.teacher?.user?.email ? course.teacher.user.email.split('@')[0] : 'Instructor',
      instructorAvatar: course.teacher?.avatar || this.mapInstructorAvatar(course.code),
      progress: 0,
      category: metadata.category,
      status: course.status === 'PUBLISHED' ? 'ACTIVE' : 'DRAFT',
      modules: formattedModules,
      credits: 3,
      price: this.mapCoursePrices(course.code),
      rating: averageRating,
      reviewsCount: reviewsCount > 0 ? reviewsCount : 15,
      studentsCount: metadata.studentsCount,
      requirements: metadata.requirements,
      gradeLevel: metadata.gradeLevel,
      reviews: reviews.map((r: any) => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        content: r.content,
        date: r.createdAt.toLocaleDateString(),
        isVerifiedPurchase: r.isVerifiedPurchase,
        helpfulCount: r.helpfulCount,
      })),
    };
  }
}
