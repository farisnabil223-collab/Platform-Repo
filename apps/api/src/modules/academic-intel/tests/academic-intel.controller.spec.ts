import { Test, TestingModule } from '@nestjs/testing';
import { AcademicIntelController } from '../presentation/academic-intel-v1.controller';

describe('AcademicIntelController', () => {
  let controller: AcademicIntelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicIntelController],
      providers: [],
    }).compile();

    controller = module.get<AcademicIntelController>(AcademicIntelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
