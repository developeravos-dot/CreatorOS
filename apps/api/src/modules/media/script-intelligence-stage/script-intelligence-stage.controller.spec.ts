import { Test } from '@nestjs/testing';
import { ScriptIntelligenceStageController } from './script-intelligence-stage.controller';
import { ScriptIntelligenceStageService } from './script-intelligence-stage.service';

describe('ScriptIntelligenceStageController', () => {
  let controller: ScriptIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ScriptIntelligenceStageController],
      providers: [ScriptIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(ScriptIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
