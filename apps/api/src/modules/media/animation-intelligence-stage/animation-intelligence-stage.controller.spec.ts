import { Test } from '@nestjs/testing';
import { AnimationIntelligenceStageController } from './animation-intelligence-stage.controller';
import { AnimationIntelligenceStageService } from './animation-intelligence-stage.service';

describe('AnimationIntelligenceStageController', () => {
  let controller: AnimationIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AnimationIntelligenceStageController],
      providers: [AnimationIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(AnimationIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
