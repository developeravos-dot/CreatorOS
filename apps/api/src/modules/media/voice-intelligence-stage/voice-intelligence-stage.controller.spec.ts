import { Test, TestingModule } from '@nestjs/testing';
import { VoiceIntelligenceStageController } from './voice-intelligence-stage.controller';
import { VoiceIntelligenceStageService } from './voice-intelligence-stage.service';

describe('VoiceIntelligenceStageController', () => {
  let controller: VoiceIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [VoiceIntelligenceStageController], providers: [VoiceIntelligenceStageService] }).compile();
    controller = module.get(VoiceIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
