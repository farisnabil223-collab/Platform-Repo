import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from '../presentation/progress.controller';
import { CompleteLessonHandler } from '../application/commands/complete-lesson.handler';
import { TrackWatchHeartbeatHandler } from '../application/commands/track-watch-heartbeat.handler';
import { CreateBookmarkHandler } from '../application/commands/create-bookmark.handler';

describe('ProgressController', () => {
  let controller: ProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: CompleteLessonHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: TrackWatchHeartbeatHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateBookmarkHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
