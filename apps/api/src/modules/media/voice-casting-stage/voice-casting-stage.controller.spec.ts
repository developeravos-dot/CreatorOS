import { Test } from '@nestjs/testing';
import { VoiceCastingStageController } from './voice-casting-stage.controller';
import { VoiceCastingStageService } from './voice-casting-stage.service';

describe('VoiceCastingStageController', () => {
  let controller: VoiceCastingStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VoiceCastingStageController],
      providers: [VoiceCastingStageService],
    }).compile();

    controller = moduleRef.get(VoiceCastingStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
