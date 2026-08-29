import { Module } from '@nestjs/common';
import { MediaController } from './presentation/media.controller';
import { IngestMediaHandler } from './application/commands/ingest-media.handler';
import { RetryMediaJobHandler } from './application/commands/retry-media-job.handler';
import { MediaAssetRepository } from '@eduverse/database';
import { IMediaProvider } from './domain/media-provider.interface';
import { CdnMediaProvider } from './infrastructure/cdn-media.provider';

@Module({
  controllers: [MediaController],
  providers: [
    IngestMediaHandler,
    RetryMediaJobHandler,
    {
      provide: MediaAssetRepository,
      useFactory: () => new MediaAssetRepository(),
    },
    {
      provide: IMediaProvider,
      useClass: CdnMediaProvider,
    },
  ],
  exports: [
    IngestMediaHandler,
    RetryMediaJobHandler,
    IMediaProvider,
  ],
})
export class MediaModule {}
