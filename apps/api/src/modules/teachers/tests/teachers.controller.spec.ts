import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from '../presentation/teachers.controller';
import { AssignTeacherSubjectHandler } from '../application/commands/assign-teacher-subject.handler';

describe('TeachersController', () => {
  let controller: TeachersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        {
          provide: AssignTeacherSubjectHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
