import { Test, TestingModule } from '@nestjs/testing';
import { CmsController } from '../presentation/cms.controller';
import { CmsService } from '../application/cms.service';

describe('CmsController', () => {
  let controller: CmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsController],
      providers: [
        {
          provide: CmsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CmsController>(CmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
