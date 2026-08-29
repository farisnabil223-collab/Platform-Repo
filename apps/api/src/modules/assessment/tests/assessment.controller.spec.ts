import { Test, TestingModule } from '@nestjs/testing';
import { StudentAssessmentController } from '../presentation/student-assessment.controller';
import { AdminAssessmentController } from '../presentation/admin-assessment.controller';
import { AssessmentAttemptService } from '../application/assessment-attempt.service';
import { AssessmentScoringPipeline } from '../application/assessment-scoring.pipeline';
import { GradebookService } from '../application/gradebook.service';

describe('AssessmentControllers', () => {
  let studentController: StudentAssessmentController;
  let adminController: AdminAssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAssessmentController, AdminAssessmentController],
      providers: [
        {
          provide: AssessmentAttemptService,
          useValue: {
            startAttempt: jest.fn().mockResolvedValue({}),
            autoSaveAnswer: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AssessmentScoringPipeline,
          useValue: {
            scoreAttempt: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: GradebookService,
          useValue: {
            adjustGrade: jest.fn().mockResolvedValue({}),
            createAppeal: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    studentController = module.get<StudentAssessmentController>(StudentAssessmentController);
    adminController = module.get<AdminAssessmentController>(AdminAssessmentController);
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
    expect(adminController).toBeDefined();
  });
});
