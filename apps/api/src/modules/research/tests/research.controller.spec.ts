import { Test, TestingModule } from '@nestjs/testing';
import { ResearchController } from '../presentation/research-v1.controller';

describe('ResearchController', () => {
  let controller: ResearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchController],
      providers: [],
    }).compile();

    controller = module.get<ResearchController>(ResearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
