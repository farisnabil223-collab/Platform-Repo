import { Module, forwardRef } from '@nestjs/common';
import { PublicCatalogController } from './presentation/public-catalog.controller';
import { CatalogService } from './application/catalog.service';
import { ICatalogRepository } from './domain/catalog.repository.interface';
import { PrismaCatalogRepository } from './infrastructure/prisma-catalog.repository';
import { StatisticsAggregatorService } from './application/statistics-aggregator.service';
import { IStatisticsRepository } from './domain/statistics.repository.interface';
import { PrismaStatisticsRepository } from './infrastructure/prisma-statistics.repository';
import { DatabaseInitializerService } from './application/database-initializer.service';
import { FeatureFlagService } from './application/feature-flag.service';
import { ISettingRepository } from './domain/setting.repository.interface';
import { PrismaSettingRepository } from './infrastructure/prisma-setting.repository';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';
import { TeachersModule } from '../teachers/teachers.module';
import { ReviewsModule } from './reviews.module';
import { SearchModule } from './search.module';
import { MediaModule } from '../media/media.module';

import { ICacheProvider } from './domain/cache-provider.interface';
import { RedisCacheProvider } from './infrastructure/redis-cache.provider';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => CoursesModule),
    TeachersModule,
    ReviewsModule,
    SearchModule,
    MediaModule,
  ],
  controllers: [PublicCatalogController],
  providers: [
    CatalogService,
    StatisticsAggregatorService,
    DatabaseInitializerService,
    FeatureFlagService,
    {
      provide: ICatalogRepository,
      useClass: PrismaCatalogRepository,
    },
    {
      provide: IStatisticsRepository,
      useClass: PrismaStatisticsRepository,
    },
    {
      provide: ISettingRepository,
      useClass: PrismaSettingRepository,
    },
    {
      provide: ICacheProvider,
      useClass: RedisCacheProvider,
    },
  ],
  exports: [
    CatalogService,
    StatisticsAggregatorService,
    FeatureFlagService,
    ICatalogRepository,
    IStatisticsRepository,
    ISettingRepository,
    ICacheProvider,
  ],
})
export class CatalogModule {}
