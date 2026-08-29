import { Test, TestingModule } from '@nestjs/testing';
import { StudentLearningController } from '../presentation/student-learning.controller';
import { AdminLearningController } from '../presentation/admin-learning.controller';
import { CourseNavigationService } from '../application/course-navigation.service';
import { LearningProgressService } from '../application/learning-progress.service';
import { StudentNotesService } from '../application/student-notes.service';
import { StudentBookmarksService } from '../application/student-bookmarks.service';
import { LessonResourcesService } from '../application/lesson-resources.service';
import { LessonTranscriptsService } from '../application/lesson-transcripts.service';

describe('LearningControllers', () => {
  let studentController: StudentLearningController;
  let adminController: AdminLearningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentLearningController, AdminLearningController],
      providers: [
        {
          provide: CourseNavigationService,
          useValue: {
            getCourseStructure: jest.fn().mockResolvedValue({}),
            getLessonNavigation: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: LearningProgressService,
          useValue: {
            syncProgress: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: StudentNotesService,
          useValue: {
            getNotes: jest.fn().mockResolvedValue([]),
            createNote: jest.fn().mockResolvedValue({}),
            deleteNote: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: StudentBookmarksService,
          useValue: {
            getBookmarks: jest.fn().mockResolvedValue([]),
            createBookmark: jest.fn().mockResolvedValue({}),
            deleteBookmark: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: LessonResourcesService,
          useValue: {
            getResources: jest.fn().mockResolvedValue([]),
            getDownloadUrl: jest.fn().mockResolvedValue(''),
          },
        },
        {
          provide: LessonTranscriptsService,
          useValue: {
            getTranscript: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    studentController = module.get<StudentLearningController>(StudentLearningController);
    adminController = module.get<AdminLearningController>(AdminLearningController);
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
    expect(adminController).toBeDefined();
  });
});
