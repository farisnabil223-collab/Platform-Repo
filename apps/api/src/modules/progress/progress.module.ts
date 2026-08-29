import { Module } from '@nestjs/common';
import { ProgressController } from './presentation/progress.controller';
import { CompleteLessonHandler } from './application/commands/complete-lesson.handler';
import { TrackWatchHeartbeatHandler } from './application/commands/track-watch-heartbeat.handler';
import { CreateBookmarkHandler } from './application/commands/create-bookmark.handler';
import {
  CourseProgressRepository,
  LessonProgressRepository,
  MediaAssetRepository
} from '@eduverse/database';

@Module({
  controllers: [ProgressController],
  providers: [
    CompleteLessonHandler,
    TrackWatchHeartbeatHandler,
    CreateBookmarkHandler,
    {
      provide: CourseProgressRepository,
      useFactory: () => new CourseProgressRepository(),
    },
    {
      provide: LessonProgressRepository,
      useFactory: () => new LessonProgressRepository(),
    },
    {
      provide: MediaAssetRepository,
      useFactory: () => new MediaAssetRepository(),
    },
  ],
  exports: [
    CompleteLessonHandler,
    TrackWatchHeartbeatHandler,
    CreateBookmarkHandler,
  ],
})
export class ProgressModule {}
