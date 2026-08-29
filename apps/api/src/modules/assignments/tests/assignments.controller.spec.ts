import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from '../presentation/assignments.controller';
import { CreateAssignmentHandler } from '../application/commands/create-assignment.handler';
import { SubmitAssignmentHandler } from '../application/commands/submit-assignment.handler';
import { GradeAssignmentHandler } from '../application/commands/grade-assignment.handler';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [
        {
          provide: CreateAssignmentHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SubmitAssignmentHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GradeAssignmentHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
