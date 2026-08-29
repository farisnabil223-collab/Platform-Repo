import { Test, TestingModule } from '@nestjs/testing';
import { BuilderController } from '../presentation/builder-v1.controller';

describe('BuilderController', () => {
  let controller: BuilderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuilderController],
      providers: [],
    }).compile();

    controller = module.get<BuilderController>(BuilderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
