import { Test, TestingModule } from '@nestjs/testing';
import { GovController } from '../presentation/gov-v1.controller';

describe('GovController', () => {
  let controller: GovController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovController],
      providers: [],
    }).compile();

    controller = module.get<GovController>(GovController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
