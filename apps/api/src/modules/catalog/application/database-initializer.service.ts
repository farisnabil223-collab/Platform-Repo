import { Injectable, OnApplicationBootstrap, Inject } from '@nestjs/common';
import { ICatalogRepository } from '../domain/catalog.repository.interface';
import { ICoursesRepository } from '../../courses/domain/courses.repository';
import { ITeachersRepository } from '../../teachers/domain/teachers.repository';
import { IReviewsRepository } from '../domain/reviews.repository.interface';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class DatabaseInitializerService implements OnApplicationBootstrap {
  constructor(
    @Inject(ICatalogRepository)
    private readonly catalogRepository: ICatalogRepository,
    @Inject(ICoursesRepository)
    private readonly coursesRepository: ICoursesRepository,
    @Inject(ITeachersRepository)
    private readonly teachersRepository: ITeachersRepository,
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async onApplicationBootstrap() {
    try {
      console.log('[Seeder] Starting Database Startup Initialization...');
      await this.seedGradesAndSubjects();
      const teachers = await this.seedTeachers();
      await this.seedCourses(teachers);
      await this.seedPlans();
      await this.seedTestimonials();
      await this.seedProductsAndCoupons();
      console.log('[Seeder] Database Startup Initialization Completed Successfully!');
    } catch (error) {
      console.error('[Seeder] Database Seeding Failed:', error);
    }
  }

  private async seedGradesAndSubjects() {
    let universityGrade = await this.userRepository.findGradeByLevel('University');
    if (!universityGrade) {
      universityGrade = await this.userRepository.createGrade({
        id: generateUuidV7(),
        level: 'University',
        name: 'University Undergraduate Level',
      });
    }
    let grade12 = await this.userRepository.findGradeByLevel('Grade 12');
    if (!grade12) {
      grade12 = await this.userRepository.createGrade({
        id: generateUuidV7(),
        level: 'Grade 12',
        name: 'High School Senior Grade 12',
      });
    }

    const subjects = await this.catalogRepository.findSubjects();
    if (subjects.length === 0) {
      await this.catalogRepository.createSubject({
        id: generateUuidV7(),
        code: 'MATH-SUBJ',
        name: 'Mathematics',
        description: 'From foundational algebra to advanced differential calculus.',
        gradeId: universityGrade.id,
      });
      await this.catalogRepository.createSubject({
        id: generateUuidV7(),
        code: 'PHYS-SUBJ',
        name: 'Science',
        description: 'Quantum wave mechanics, astrophysics, and chemistry.',
        gradeId: grade12.id,
      });
      await this.catalogRepository.createSubject({
        id: generateUuidV7(),
        code: 'TECH-SUBJ',
        name: 'Technology',
        description: 'Operating systems, algorithms, and engineering frameworks.',
        gradeId: universityGrade.id,
      });
      await this.catalogRepository.createSubject({
        id: generateUuidV7(),
        code: 'HUM-SUBJ',
        name: 'Humanities',
        description: 'Literature, philosophy, and history outlines.',
        gradeId: grade12.id,
      });
      console.log('[Seeder] Seeded Grades and Subjects.');
    }
  }

  private async seedTeachers(): Promise<Record<string, string>> {
    const teacherMapping: Record<string, string> = {};

    let teacherRole = await this.userRepository.findRoleByName('TEACHER');
    if (!teacherRole) {
      teacherRole = await this.userRepository.createRole({
        id: generateUuidV7(),
        name: 'TEACHER',
        description: 'Teacher profile role',
      });
    }

    const teacherData = [
      { email: 'sara@eduverse.com', code: 'TCH-9936', specialties: ['الرياضيات', 'الهندسة'], bio: 'مدرسة واستشارية مادة الرياضيات العامة والهندسة الفراغية.' },
      { email: 'tarek@eduverse.com', code: 'TCH-9935', specialties: ['الفيزياء', 'الميكانيكا'], bio: 'مدرس واستشاري مادة الفيزياء التطبيقية والكهربية للثانوية العامة والجامعات.' },
    ];

    for (const data of teacherData) {
      let user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        const userId = generateUuidV7();
        user = await this.userRepository.create({
          id: userId,
          email: data.email,
          passwordHash: '$2b$10$dev_only_hashed_pass_placeholder_key_val_sec',
        });
        await this.userRepository.assignRole(user.id, teacherRole.id);
      }

      let profile = await this.teachersRepository.findByIdOrCode(data.code);
      if (!profile) {
        profile = await this.teachersRepository.create({
          id: generateUuidV7(),
          userId: user.id,
          teacherCode: data.code,
          bio: data.bio,
          specialties: data.specialties,
        });
      }
      teacherMapping[data.code] = profile.id;
    }

    return teacherMapping;
  }

  private async seedCourses(teachers: Record<string, string>) {
    const coursesCount = await this.coursesRepository.count();
    if (coursesCount === 0) {
      // 1. Calculus I
      const calcId = generateUuidV7();
      await this.coursesRepository.create({
        id: calcId,
        code: 'MATH-101',
        slug: 'calculus-i-limits-integration',
        title: 'Calculus I: Limits & Integration',
        description: 'Master single-variable Calculus from the ground up.',
        teacherId: teachers['TCH-9932'],
        status: 'PUBLISHED',
      });

      const m1 = await this.userRepository.createModule({
        id: generateUuidV7(),
        courseId: calcId,
        code: 'MATH-MOD-1',
        title: 'Limits & Continuity',
        sortOrder: 1,
      });
      await this.userRepository.createLesson({
        id: generateUuidV7(),
        moduleId: m1.id,
        code: 'MATH-LES-1',
        title: 'Introduction to Limits',
        sortOrder: 1,
      });
      await this.userRepository.createLesson({
        id: generateUuidV7(),
        moduleId: m1.id,
        code: 'MATH-LES-2',
        title: 'Continuity & Intermediate Value Theorem',
        sortOrder: 2,
      });

      const m2 = await this.userRepository.createModule({
        id: generateUuidV7(),
        courseId: calcId,
        code: 'MATH-MOD-2',
        title: 'Derivatives & Applications',
        sortOrder: 2,
      });
      await this.userRepository.createLesson({
        id: generateUuidV7(),
        moduleId: m2.id,
        code: 'MATH-LES-3',
        title: 'Power Rule, Product Rule, Quotient Rule',
        sortOrder: 1,
      });

      // 2. Quantum Physics
      const physId = generateUuidV7();
      await this.coursesRepository.create({
        id: physId,
        code: 'PHYS-202',
        slug: 'quantum-physics-modern-wave-mechanics',
        title: 'Quantum Physics: Modern Wave Mechanics',
        description: 'Delve into wave functions and subatomic principles.',
        teacherId: teachers['TCH-9933'],
        status: 'PUBLISHED',
      });

      const pm1 = await this.userRepository.createModule({
        id: generateUuidV7(),
        courseId: physId,
        code: 'PHYS-MOD-1',
        title: 'Foundations of Quantum Mechanics',
        sortOrder: 1,
      });
      await this.userRepository.createLesson({
        id: generateUuidV7(),
        moduleId: pm1.id,
        code: 'PHYS-LES-1',
        title: 'The Photoelectric Effect & Quantum State',
        sortOrder: 1,
      });

      // 3. Operating Systems
      const osId = generateUuidV7();
      await this.coursesRepository.create({
        id: osId,
        code: 'CS-301',
        slug: 'systems-architecture-operating-systems',
        title: 'Systems Architecture & Operating Systems',
        description: 'Explore monolithic kernels, scheduling, and concurrency.',
        teacherId: teachers['TCH-9934'],
        status: 'PUBLISHED',
      });

      const osm1 = await this.userRepository.createModule({
        id: generateUuidV7(),
        courseId: osId,
        code: 'CS-MOD-1',
        title: 'Kernel & Process Management',
        sortOrder: 1,
      });
      await this.userRepository.createLesson({
        id: generateUuidV7(),
        moduleId: osm1.id,
        code: 'CS-LES-1',
        title: 'Process Lifecycle and Thread Switching',
        sortOrder: 1,
      });

      // Seed Initial Reviews
      await this.reviewsRepository.create({
        id: generateUuidV7(),
        courseId: calcId,
        authorName: 'Sarah Jenkins',
        rating: 5,
        content: 'Dr. Emily is amazing! The lectures on Limits are very visual and easy to understand.',
        verified: true,
        status: 'APPROVED',
        isVerifiedPurchase: true,
      });
      await this.reviewsRepository.create({
        id: generateUuidV7(),
        courseId: calcId,
        authorName: 'James Miller',
        rating: 4,
        content: 'Good material, but derivatives homework was quite challenging.',
        verified: true,
        status: 'APPROVED',
        isVerifiedPurchase: true,
      });
      await this.reviewsRepository.create({
        id: generateUuidV7(),
        courseId: physId,
        authorName: 'David Zhang',
        rating: 5,
        content: 'This wave mechanics course is top notch. Conceptual animations helped me wrap my head around Schrodinger equation.',
        verified: true,
        status: 'APPROVED',
        isVerifiedPurchase: true,
      });

      console.log('[Seeder] Seeded Courses, Modules, Lessons, and Reviews.');
    }
  }

  private async seedPlans() {
    const plans = await this.catalogRepository.findPricingPlans();
    if (plans.length === 0) {
      await this.catalogRepository.createSubscriptionPlan({
        id: generateUuidV7(),
        code: 'free',
        name: 'Free Plan',
        interval: 'one-time',
        price: 0,
      });
      await this.catalogRepository.createSubscriptionPlan({
        id: generateUuidV7(),
        code: 'single-course',
        name: 'Single Course Purchase',
        interval: 'one-time',
        price: 49,
      });
      await this.catalogRepository.createSubscriptionPlan({
        id: generateUuidV7(),
        code: 'bundles',
        name: 'Course Bundles',
        interval: 'one-time',
        price: 99,
      });
      await this.catalogRepository.createSubscriptionPlan({
        id: generateUuidV7(),
        code: 'teacher-plan',
        name: 'Teacher Subscription',
        interval: 'month',
        price: 29,
      });
      await this.catalogRepository.createSubscriptionPlan({
        id: generateUuidV7(),
        code: 'annual-plan',
        name: 'Annual Student Subscription',
        interval: 'year',
        price: 199,
      });
      console.log('[Seeder] Seeded Subscription Plans.');
    }
  }

  private async seedTestimonials() {
    const testimonials = await this.catalogRepository.findTestimonials();
    if (testimonials.length === 0) {
      await this.catalogRepository.createTestimonial({
        id: generateUuidV7(),
        name: 'Sarah L.',
        role: 'Parent',
        avatar: 'SL',
        quote: 'The Calculus course transformed my daughter\'s understanding of derivatives. Her test scores increased from C to A in weeks!',
        rating: 5,
      });
      await this.catalogRepository.createTestimonial({
        id: generateUuidV7(),
        name: 'David K.',
        role: 'Student',
        avatar: 'DK',
        quote: 'Operating Systems course is incredible. Hands-on bare metal C scheduling assignments gave me deep system insights.',
        rating: 5,
      });
      await this.catalogRepository.createTestimonial({
        id: generateUuidV7(),
        name: 'Mrs. Cynthia M.',
        role: 'Parent',
        avatar: 'CM',
        quote: 'EduVerse provided my home-schooled son with university-grade physics materials that are both interactive and engaging.',
        rating: 5,
      });
      console.log('[Seeder] Seeded Testimonials.');
    }
  }

  private async seedProductsAndCoupons() {
    try {
      const { prisma: localPrisma } = require('@eduverse/database');
      const { generateUuidV7 } = require('@eduverse/kernel');

      const productsCount = await localPrisma.product.count();
      if (productsCount === 0) {
        const calc = await localPrisma.course.findUnique({ where: { code: 'MATH-101' } });
        const phys = await localPrisma.course.findUnique({ where: { code: 'PHYS-202' } });
        const os = await localPrisma.course.findUnique({ where: { code: 'CS-301' } });

        if (calc) {
          await localPrisma.product.create({
            data: {
              id: generateUuidV7(),
              slug: 'calculus-i',
              title: 'Calculus I: Limits & Integration',
              description: calc.description,
              price: 49.99,
              type: 'COURSE',
              targetType: 'COURSE',
              targetId: calc.id,
              status: 'ACTIVE',
              visibility: 'PUBLIC',
              searchTitle: 'Calculus I: Limits & Integration',
              seoSlug: 'calculus-i',
            }
          });
        }

        if (phys) {
          await localPrisma.product.create({
            data: {
              id: generateUuidV7(),
              slug: 'quantum-physics',
              title: 'Quantum Physics: Modern Wave Mechanics',
              description: phys.description,
              price: 79.99,
              type: 'COURSE',
              targetType: 'COURSE',
              targetId: phys.id,
              status: 'ACTIVE',
              visibility: 'PUBLIC',
              searchTitle: 'Quantum Physics: Modern Wave Mechanics',
              seoSlug: 'quantum-physics',
            }
          });
        }

        if (os) {
          await localPrisma.product.create({
            data: {
              id: generateUuidV7(),
              slug: 'operating-systems',
              title: 'Systems Architecture & Operating Systems',
              description: os.description,
              price: 89.99,
              type: 'COURSE',
              targetType: 'COURSE',
              targetId: os.id,
              status: 'ACTIVE',
              visibility: 'PUBLIC',
              searchTitle: 'Systems Architecture & Operating Systems',
              seoSlug: 'operating-systems',
            }
          });
        }

        // Create a Bundle
        const bundleId = generateUuidV7();
        const bundle = await localPrisma.bundle.create({
          data: {
            id: bundleId,
            slug: 'science-math-bundle',
            name: 'Science & Math Masterclass Bundle',
            description: 'Get both Calculus I and Quantum Physics at a discount.',
            price: 99.99,
          }
        });

        if (calc && phys) {
          await localPrisma.bundleCourse.createMany({
            data: [
              { bundleId: bundle.id, courseId: calc.id },
              { bundleId: bundle.id, courseId: phys.id },
            ]
          });

          await localPrisma.product.create({
            data: {
              id: generateUuidV7(),
              slug: 'science-math-bundle',
              title: 'Science & Math Masterclass Bundle',
              description: bundle.description,
              price: 99.99,
              type: 'BUNDLE',
              targetType: 'BUNDLE',
              targetId: bundle.id,
              status: 'ACTIVE',
              visibility: 'PUBLIC',
              searchTitle: 'Science & Math Masterclass Bundle',
              seoSlug: 'science-math-bundle',
            }
          });
        }

        // Create a Plan Product
        const yearlyPlan = await localPrisma.subscriptionPlan.findUnique({
          where: { code: 'annual-plan' },
        });
        if (yearlyPlan) {
          await localPrisma.product.create({
            data: {
              id: generateUuidV7(),
              slug: 'annual-student-subscription',
              title: 'Annual Student Subscription',
              description: 'Access to all courses, exams, and certificates for one year.',
              price: 199.99,
              type: 'PLAN',
              targetType: 'PLAN',
              targetId: yearlyPlan.id,
              status: 'ACTIVE',
              visibility: 'PUBLIC',
              searchTitle: 'Annual Student Subscription',
              seoSlug: 'annual-student-subscription',
            }
          });
        }

        console.log('[Seeder] Seeded Commerce Products.');
      }

      const couponCount = await localPrisma.coupon.count();
      if (couponCount === 0) {
        const campaignId = generateUuidV7();
        await localPrisma.discountCampaign.create({
          data: {
            id: campaignId,
            name: 'General Discount Campaign',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000),
          }
        });

        await localPrisma.coupon.create({
          data: {
            id: generateUuidV7(),
            campaignId,
            code: 'EDU50',
            type: 'PERCENTAGE',
            value: 50,
            usageLimit: 100,
            maxPerUser: 1,
          }
        });

        await localPrisma.coupon.create({
          data: {
            id: generateUuidV7(),
            campaignId,
            code: 'WELCOME10',
            type: 'FIXED_AMOUNT',
            value: 10,
            usageLimit: 100,
            maxPerUser: 1,
          }
        });

        console.log('[Seeder] Seeded Coupons.');
      }
    } catch (error) {
      console.warn('[Seeder] seedProductsAndCoupons skipped due to offline database connection.');
    }
  }
}
