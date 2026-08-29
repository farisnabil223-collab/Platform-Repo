import { Test, TestingModule } from '@nestjs/testing';
import { ExamsController } from '../presentation/exams.controller';
import { ExamsService } from '../application/exams.service';

describe('ExamsController', () => {
  let controller: ExamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [
        {
          provide: ExamsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExamsController>(ExamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
