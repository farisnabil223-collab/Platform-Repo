import { Module } from '@nestjs/common';
import { StudentLearningController } from './presentation/student-learning.controller';
import { AdminLearningController } from './presentation/admin-learning.controller';
import { CourseNavigationService } from './application/course-navigation.service';
import { LearningProgressService } from './application/learning-progress.service';
import { VideoPlayerService } from './application/video-player.service';
import { StudentNotesService } from './application/student-notes.service';
import { StudentBookmarksService } from './application/student-bookmarks.service';
import { LessonResourcesService } from './application/lesson-resources.service';
import { LessonTranscriptsService } from './application/lesson-transcripts.service';
import { CourseCompletionEngine } from './application/course-completion.engine';
import { LessonAccessPolicy } from './domain/lesson-access.policy';
import { IContentDeliveryProvider } from './domain/content-delivery.provider.interface';
import { S3ContentDeliveryProvider } from './provider/s3-content-delivery.provider';

@Module({
  controllers: [StudentLearningController, AdminLearningController],
  providers: [
    CourseNavigationService,
    LearningProgressService,
    VideoPlayerService,
    StudentNotesService,
    StudentBookmarksService,
    LessonResourcesService,
    LessonTranscriptsService,
    CourseCompletionEngine,
    LessonAccessPolicy,
    {
      provide: IContentDeliveryProvider,
      useClass: S3ContentDeliveryProvider,
    },
  ],
  exports: [
    CourseNavigationService,
    LearningProgressService,
    VideoPlayerService,
    CourseCompletionEngine,
  ],
})
export class LearningModule {}
