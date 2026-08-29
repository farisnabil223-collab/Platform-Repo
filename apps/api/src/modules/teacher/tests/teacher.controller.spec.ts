import { Test, TestingModule } from '@nestjs/testing';
import { InstructorStudioController } from '../presentation/instructor-studio.controller';
import { AdminContentController } from '../presentation/admin-content.controller';
import { CourseDuplicationEngine } from '../application/course-duplication.engine';
import { MediaLibraryService } from '../application/media-library.service';
import { PublishingWorkflowService } from '../application/publishing-workflow.service';
import { EditingLockService } from '../domain/editing-lock.service';
import { ContentQualityService } from '../domain/content-quality.service';

describe('TeacherStudioControllers', () => {
  let instructorController: InstructorStudioController;
  let adminController: AdminContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorStudioController, AdminContentController],
      providers: [
        {
          provide: CourseDuplicationEngine,
          useValue: {
            cloneCourse: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: MediaLibraryService,
          useValue: {
            createFolder: jest.fn().mockResolvedValue({}),
            uploadAsset: jest.fn().mockResolvedValue({}),
            listFolders: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: PublishingWorkflowService,
          useValue: {
            submitForReview: jest.fn().mockResolvedValue({}),
            schedulePublish: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: EditingLockService,
          useValue: {
            acquireLock: jest.fn().mockResolvedValue({}),
            releaseLock: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ContentQualityService,
          useValue: {
            calculateCourseQualityScore: jest.fn().mockResolvedValue(100),
          },
        },
      ],
    }).compile();

    instructorController = module.get<InstructorStudioController>(InstructorStudioController);
    adminController = module.get<AdminContentController>(AdminContentController);
  });

  it('should be defined', () => {
    expect(instructorController).toBeDefined();
    expect(adminController).toBeDefined();
  });
});
