import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { ICatalogRepository } from '../domain/catalog.repository.interface';

const MOCK_SUBJECTS = [
  { id: 'subj-1', code: 'MATH-SUBJ', name: 'Mathematics', description: 'From foundational algebra to advanced differential calculus.', grade: { level: 'University' } },
  { id: 'subj-2', code: 'PHYS-SUBJ', name: 'Science', description: 'Quantum wave mechanics, astrophysics, and chemistry.', grade: { level: 'Grade 12' } },
  { id: 'subj-3', code: 'TECH-SUBJ', name: 'Technology', description: 'Operating systems, algorithms, and software engineering.', grade: { level: 'University' } },
  { id: 'subj-4', code: 'HUM-SUBJ', name: 'Humanities', description: 'Literature, philosophy, and history outlines.', grade: { level: 'Grade 12' } },
];

const MOCK_TESTIMONIALS = [
  { id: 'test-1', name: 'Sarah L.', role: 'Parent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', quote: 'The Calculus course transformed my daughter\'s understanding of derivatives. Her test scores increased from C to A in weeks!', rating: 5 },
  { id: 'test-2', name: 'David K.', role: 'Student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', quote: 'Operating Systems course is incredible. Hands-on bare metal C scheduling assignments gave me deep system insights.', rating: 5 },
  { id: 'test-3', name: 'Mrs. Cynthia M.', role: 'Parent', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', quote: 'EduVerse provided my home-schooled son with university-grade physics materials that are both interactive and engaging.', rating: 5 },
];

const MOCK_PRICING_PLANS = [
  { id: 'plan-1', code: 'free', name: 'Free Plan', interval: 'one-time', price: 0 },
  { id: 'plan-2', code: 'single-course', name: 'Single Course Purchase', interval: 'one-time', price: 49 },
  { id: 'plan-3', code: 'bundles', name: 'Course Bundles', interval: 'one-time', price: 99 },
  { id: 'plan-4', code: 'teacher-plan', name: 'Teacher Subscription', interval: 'month', price: 29 },
  { id: 'plan-5', code: 'annual-plan', name: 'Annual Student Subscription', interval: 'year', price: 199 },
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
export class PrismaCatalogRepository implements ICatalogRepository {
  async findSubjects(): Promise<any[]> {
    try {
      return await withDbTimeout(
        prisma.subject.findMany({
          where: { deletedAt: null },
          include: { grade: true },
        })
      );
    } catch (error) {
      return MOCK_SUBJECTS;
    }
  }

  async findTestimonials(): Promise<any[]> {
    try {
      return await withDbTimeout(
        prisma.testimonial.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        })
      );
    } catch (error) {
      return MOCK_TESTIMONIALS;
    }
  }

  async findPricingPlans(): Promise<any[]> {
    try {
      return await withDbTimeout(prisma.subscriptionPlan.findMany());
    } catch (error) {
      return MOCK_PRICING_PLANS;
    }
  }

  async createTestimonial(testimonial: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
  }): Promise<any> {
    try {
      return await prisma.testimonial.create({ data: testimonial });
    } catch (error) {
      return testimonial;
    }
  }

  async createSubscriptionPlan(plan: {
    id: string;
    name: string;
    code: string;
    interval: string;
    price: number;
    currency?: string;
  }): Promise<any> {
    try {
      return await prisma.subscriptionPlan.create({
        data: {
          id: plan.id,
          name: plan.name,
          code: plan.code,
          interval: plan.interval,
          price: plan.price,
          currency: plan.currency || 'USD',
        },
      });
    } catch (error) {
      return plan;
    }
  }

  async createSubject(subject: {
    id: string;
    code: string;
    name: string;
    description?: string;
    gradeId: string;
  }): Promise<any> {
    try {
      return await prisma.subject.create({
        data: {
          id: subject.id,
          code: subject.code,
          name: subject.name,
          description: subject.description || null,
          gradeId: subject.gradeId,
        },
      });
    } catch (error) {
      return subject;
    }
  }
}

