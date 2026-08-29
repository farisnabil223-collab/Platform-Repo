export interface ICatalogRepository {
  findSubjects(): Promise<any[]>;
  findTestimonials(): Promise<any[]>;
  findPricingPlans(): Promise<any[]>;
  createTestimonial(testimonial: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
  }): Promise<any>;
  createSubscriptionPlan(plan: {
    id: string;
    name: string;
    code: string;
    interval: string;
    price: number;
    currency?: string;
  }): Promise<any>;
  createSubject(subject: {
    id: string;
    code: string;
    name: string;
    description?: string;
    gradeId: string;
  }): Promise<any>;
}
export const ICatalogRepository = Symbol('ICatalogRepository');
