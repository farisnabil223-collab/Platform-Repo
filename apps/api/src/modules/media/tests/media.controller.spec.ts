import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from '../presentation/media.controller';
import { IngestMediaHandler } from '../application/commands/ingest-media.handler';
import { RetryMediaJobHandler } from '../application/commands/retry-media-job.handler';

describe('MediaController', () => {
  let controller: MediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: IngestMediaHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RetryMediaJobHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
