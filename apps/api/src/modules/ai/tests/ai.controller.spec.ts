import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from '../presentation/ai.controller';
import { IChatProvider, IContentGenerationProvider } from '../domain/ai-providers.interface';

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: IChatProvider,
          useValue: {
            sendMessage: jest.fn().mockResolvedValue({ reply: 'hello' }),
          },
        },
        {
          provide: IContentGenerationProvider,
          useValue: {
            generateLessonContent: jest.fn().mockResolvedValue('<p>content</p>'),
          },
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
