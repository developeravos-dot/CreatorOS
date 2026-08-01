import { Test } from '@nestjs/testing';
import { LightingIntelligenceStageController } from './lighting-intelligence-stage.controller';
import { LightingIntelligenceStageService } from './lighting-intelligence-stage.service';

describe('LightingIntelligenceStageController', () => {
  let controller: LightingIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LightingIntelligenceStageController],
      providers: [LightingIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(LightingIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
