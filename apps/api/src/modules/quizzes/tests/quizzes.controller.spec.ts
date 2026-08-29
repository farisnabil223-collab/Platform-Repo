import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesController } from '../presentation/quizzes.controller';
import { CreateQuizHandler } from '../application/commands/create-quiz.handler';
import { SubmitQuizAttemptHandler } from '../application/commands/submit-quiz-attempt.handler';

describe('QuizzesController', () => {
  let controller: QuizzesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzesController],
      providers: [
        {
          provide: CreateQuizHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SubmitQuizAttemptHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<QuizzesController>(QuizzesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
