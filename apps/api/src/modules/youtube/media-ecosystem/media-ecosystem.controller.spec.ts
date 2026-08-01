import { Test, TestingModule } from '@nestjs/testing';
import { MediaEcosystemController } from './media-ecosystem.controller';

describe('MediaEcosystemController', () => {
  let controller: MediaEcosystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaEcosystemController],
    }).compile();

    controller = module.get<MediaEcosystemController>(MediaEcosystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
