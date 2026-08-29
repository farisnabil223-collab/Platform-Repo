import { Test, TestingModule } from '@nestjs/testing';
import { HomeworkController } from '../presentation/homework.controller';
import { HomeworkService } from '../application/homework.service';

describe('HomeworkController', () => {
  let controller: HomeworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeworkController],
      providers: [
        {
          provide: HomeworkService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HomeworkController>(HomeworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
