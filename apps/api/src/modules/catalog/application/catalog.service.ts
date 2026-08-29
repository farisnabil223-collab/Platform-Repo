import { Injectable, Inject } from '@nestjs/common';
import { ICatalogRepository } from '../domain/catalog.repository.interface';
import { ICacheProvider } from '../domain/cache-provider.interface';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(ICatalogRepository)
    private readonly catalogRepository: ICatalogRepository,
    @Inject(ICacheProvider)
    private readonly cacheProvider: ICacheProvider
  ) {}

  async getSubjects(): Promise<any[]> {
    const cacheKey = 'catalog:subjects';
    const cached = await this.cacheProvider.get<any[]>(cacheKey);
    if (cached) return cached;

    const subjects = await this.catalogRepository.findSubjects();
    await this.cacheProvider.set(cacheKey, subjects, 3600); // 1 hour TTL
    return subjects;
  }

  async getTestimonials(): Promise<any[]> {
    const cacheKey = 'catalog:testimonials';
    const cached = await this.cacheProvider.get<any[]>(cacheKey);
    if (cached) return cached;

    const testimonials = await this.catalogRepository.findTestimonials();
    await this.cacheProvider.set(cacheKey, testimonials, 1800); // 30 mins TTL
    return testimonials;
  }

  async getPricingPlans(): Promise<any[]> {
    const cacheKey = 'catalog:pricing';
    const cached = await this.cacheProvider.get<any[]>(cacheKey);
    if (cached) return cached;

    const plans = await this.catalogRepository.findPricingPlans();
    await this.cacheProvider.set(cacheKey, plans, 86400); // 1 day TTL
    return plans;
  }
}
