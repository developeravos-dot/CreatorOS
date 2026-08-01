import { Test } from '@nestjs/testing';
import { PlatformAdaptationStageController } from './platform-adaptation-stage.controller';
import { PlatformAdaptationStageService } from './platform-adaptation-stage.service';

describe('PlatformAdaptationStageController', () => {
  let controller: PlatformAdaptationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PlatformAdaptationStageController],
      providers: [PlatformAdaptationStageService],
    }).compile();

    controller = moduleRef.get(PlatformAdaptationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
