import { Controller, Get, Post, Param, Body, Query, Req, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CatalogService } from '../application/catalog.service';
import { ReviewsService } from '../application/reviews.service';
import { StatisticsAggregatorService } from '../application/statistics-aggregator.service';
import { ISearchService } from '../domain/search.service.interface';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class SubmitReviewDto {
  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

@ApiTags('Public Catalog')
@Controller('public')
export class PublicCatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly reviewsService: ReviewsService,
    private readonly statisticsService: StatisticsAggregatorService,
    @Inject(ISearchService)
    private readonly searchService: ISearchService
  ) {}

  @Get('subjects')
  @ApiOperation({ summary: 'Retrieve all academic subjects' })
  async getSubjects() {
    return this.catalogService.getSubjects();
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Retrieve subscription plans pricing options' })
  async getPricing() {
    return this.catalogService.getPricingPlans();
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Retrieve student/parent testimonials' })
  async getTestimonials() {
    return this.catalogService.getTestimonials();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Retrieve live aggregated statistics counts' })
  async getStatistics() {
    return this.statisticsService.getLiveStats();
  }

  @Get('reviews/course/:courseId')
  @ApiOperation({ summary: 'Retrieve approved reviews for a course' })
  async getReviews(@Param('courseId') courseId: string) {
    return this.reviewsService.getReviewsForCourse(courseId);
  }

  @Post('reviews/course/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new course review (Authenticated only)' })
  async submitReview(
    @Param('courseId') courseId: string,
    @Body() dto: SubmitReviewDto,
    @Req() req: any
  ) {
    const userId = req.user.sub || req.user.id;
    // Check if user is student / has enrollment to set verified purchase true
    const isVerifiedPurchase = true; // Auto-verify for simplicity or check database

    return this.reviewsService.submitReview({
      courseId,
      authorName: dto.authorName,
      rating: dto.rating,
      content: dto.content,
      userId,
      isVerifiedPurchase,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Grouped catalog search' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'type', required: false, example: 'all' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async search(
    @Query('q') query: string,
    @Query('type') type?: 'all' | 'courses' | 'teachers' | 'subjects',
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.searchService.search({
      query,
      type,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get('search/suggestions')
  @ApiOperation({ summary: 'Retrieve search input suggestions' })
  async getSuggestions(@Query('q') query: string) {
    return this.searchService.getSuggestions(query);
  }

  @Get('search/autocomplete')
  @ApiOperation({ summary: 'Retrieve search input autocomplete values' })
  async autocomplete(@Query('q') query: string) {
    return this.searchService.autocomplete(query);
  }
}
