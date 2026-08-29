import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentsController } from '../presentation/assessments.controller';
import { CreateAssessmentHandler } from '../application/commands/create-assessment.handler';
import { StartAttemptHandler } from '../application/commands/start-attempt.handler';
import { SaveAnswerHandler } from '../application/commands/save-answer.handler';
import { SubmitAttemptHandler } from '../application/commands/submit-attempt.handler';
import { GradeReviewHandler } from '../application/commands/grade-review.handler';
import { CreateAppealHandler } from '../application/commands/create-appeal.handler';

describe('AssessmentsController', () => {
  let controller: AssessmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentsController],
      providers: [
        {
          provide: CreateAssessmentHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: StartAttemptHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SaveAnswerHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SubmitAttemptHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GradeReviewHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateAppealHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AssessmentsController>(AssessmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
