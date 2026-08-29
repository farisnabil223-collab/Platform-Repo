import { Test, TestingModule } from '@nestjs/testing';
import { ParentController } from '../presentation/parent.controller';
import { StudentSuccessController } from '../presentation/student-success.controller';
import { StudentRiskController } from '../presentation/student-risk.controller';
import { StudentCasesController } from '../presentation/student-cases.controller';
import { ParentService } from '../application/parent.service';
import { CaseManagementService } from '../application/case-management.service';
import { IRiskScoringProvider, ISuccessScoringProvider, IRecommendationProvider } from '../domain/scoring-providers.interface';

describe('ParentModuleControllers', () => {
  let parentController: ParentController;
  let successController: StudentSuccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ParentController,
        StudentSuccessController,
        StudentRiskController,
        StudentCasesController,
      ],
      providers: [
        {
          provide: ParentService,
          useValue: {
            linkStudent: jest.fn().mockResolvedValue({}),
            verifyAccess: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: CaseManagementService,
          useValue: {
            openCase: jest.fn().mockResolvedValue({}),
            addTask: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: IRiskScoringProvider,
          useValue: {
            calculateRisk: jest.fn().mockResolvedValue({ level: 'LOW', score: 0 }),
          },
        },
        {
          provide: ISuccessScoringProvider,
          useValue: {
            calculateSuccessScore: jest.fn().mockResolvedValue(100),
          },
        },
        {
          provide: IRecommendationProvider,
          useValue: {
            getRecommendations: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    parentController = module.get<ParentController>(ParentController);
    successController = module.get<StudentSuccessController>(StudentSuccessController);
  });

  it('should be defined', () => {
    expect(parentController).toBeDefined();
    expect(successController).toBeDefined();
  });
});
