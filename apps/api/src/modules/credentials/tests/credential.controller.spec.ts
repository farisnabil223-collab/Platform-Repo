import { Test, TestingModule } from '@nestjs/testing';
import { CredentialController } from '../presentation/credential.controller';
import { RenderingService } from '../application/rendering.service';

describe('CredentialController', () => {
  let controller: CredentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialController],
      providers: [RenderingService],
    }).compile();

    controller = module.get<CredentialController>(CredentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
