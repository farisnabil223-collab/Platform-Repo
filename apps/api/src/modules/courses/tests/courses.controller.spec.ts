import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from '../presentation/courses.controller';
import { CreateCourseHandler } from '../application/commands/create-course.handler';
import { CreateModuleHandler } from '../application/commands/create-module.handler';
import { CreateLessonHandler } from '../application/commands/create-lesson.handler';
import { CreateLearningContentHandler } from '../application/commands/create-learning-content.handler';
import { PublishCourseHandler } from '../application/commands/publish-course.handler';
import { ArchiveCourseHandler } from '../application/commands/archive-course.handler';

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CreateCourseHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateModuleHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateLessonHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateLearningContentHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: PublishCourseHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ArchiveCourseHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
