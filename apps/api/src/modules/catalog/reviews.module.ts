import { Module, forwardRef } from '@nestjs/common';
import { IReviewsRepository } from './domain/reviews.repository.interface';
import { PrismaReviewsRepository } from './infrastructure/prisma-reviews.repository';
import { ReviewsService } from './application/reviews.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    AuditModule,
  ],
  providers: [
    ReviewsService,
    {
      provide: IReviewsRepository,
      useClass: PrismaReviewsRepository,
    },
  ],
  exports: [
    ReviewsService,
    IReviewsRepository,
  ],
})
export class ReviewsModule {}
