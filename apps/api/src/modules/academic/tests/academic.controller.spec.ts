import { Test, TestingModule } from '@nestjs/testing';
import { AcademicController } from '../presentation/academic.controller';
import { CreateGradeHandler } from '../application/commands/create-grade.handler';
import { CreateSubjectHandler } from '../application/commands/create-subject.handler';
import { CreateClassroomHandler } from '../application/commands/create-classroom.handler';
import { CreateSectionHandler } from '../application/commands/create-section.handler';
import { CreateAcademicYearHandler } from '../application/commands/create-academic-year.handler';
import { TransitionYearHandler } from '../application/commands/transition-year.handler';

describe('AcademicController', () => {
  let controller: AcademicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicController],
      providers: [
        {
          provide: CreateGradeHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateSubjectHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateClassroomHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateSectionHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateAcademicYearHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: TransitionYearHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AcademicController>(AcademicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
