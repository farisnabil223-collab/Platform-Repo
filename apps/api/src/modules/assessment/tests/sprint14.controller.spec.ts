import { Test, TestingModule } from '@nestjs/testing';
import { ExamRuntimeController } from '../presentation/exam-runtime.controller';
import { IntegrityController } from '../presentation/integrity.controller';
import { CertificatesController } from '../presentation/certificates.controller';
import { AnalyticsController } from '../presentation/analytics.controller';
import { ExamEngineService } from '../application/exam-engine.service';
import { IntegrityService } from '../application/integrity.service';
import { CertificationService } from '../application/certification.service';
import { AssessmentAnalyticsService } from '../application/assessment-analytics.service';

describe('AssessmentSprint14Controllers', () => {
  let examController: ExamRuntimeController;
  let integrityController: IntegrityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ExamRuntimeController,
        IntegrityController,
        CertificatesController,
        AnalyticsController,
      ],
      providers: [
        {
          provide: ExamEngineService,
          useValue: {
            sendHeartbeat: jest.fn().mockResolvedValue({}),
            saveCheckpoint: jest.fn().mockResolvedValue({}),
            getLatestCheckpoint: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: IntegrityService,
          useValue: {
            logIncident: jest.fn().mockResolvedValue({}),
            calculateRisk: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CertificationService,
          useValue: {
            enqueueIssuance: jest.fn().mockResolvedValue({}),
            verifyCertificate: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AssessmentAnalyticsService,
          useValue: {
            getAssessmentStats: jest.fn().mockResolvedValue({}),
            getQuestionStats: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    examController = module.get<ExamRuntimeController>(ExamRuntimeController);
    integrityController = module.get<IntegrityController>(IntegrityController);
  });

  it('should be defined', () => {
    expect(examController).toBeDefined();
    expect(integrityController).toBeDefined();
  });
});
