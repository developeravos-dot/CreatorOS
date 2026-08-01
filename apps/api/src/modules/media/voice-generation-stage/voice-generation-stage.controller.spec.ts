import { Test } from '@nestjs/testing';
import { VoiceGenerationStageController } from './voice-generation-stage.controller';
import { VoiceGenerationStageService } from './voice-generation-stage.service';

describe('VoiceGenerationStageController', () => {
  let controller: VoiceGenerationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VoiceGenerationStageController],
      providers: [VoiceGenerationStageService],
    }).compile();

    controller = moduleRef.get(VoiceGenerationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
