import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../presentation/students.controller';
import { EnrollStudentHandler } from '../application/commands/enroll-student.handler';
import { TransferStudentSectionHandler } from '../application/commands/transfer-student-section.handler';
import { LinkGuardianHandler } from '../application/commands/link-guardian.handler';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: EnrollStudentHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: TransferStudentSectionHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: LinkGuardianHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
