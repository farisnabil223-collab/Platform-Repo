import { Module } from '@nestjs/common';
import { ISearchService } from './domain/search.service.interface';
import { PrismaSearchService } from './infrastructure/prisma-search.service';

@Module({
  providers: [
    {
      provide: ISearchService,
      useClass: PrismaSearchService,
    },
  ],
  exports: [
    ISearchService,
  ],
})
export class SearchModule {}
