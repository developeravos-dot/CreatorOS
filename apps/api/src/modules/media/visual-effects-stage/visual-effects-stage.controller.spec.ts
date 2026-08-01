import { Test } from '@nestjs/testing';
import { VisualEffectsStageController } from './visual-effects-stage.controller';
import { VisualEffectsStageService } from './visual-effects-stage.service';

describe('VisualEffectsStageController', () => {
  let controller: VisualEffectsStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VisualEffectsStageController],
      providers: [VisualEffectsStageService],
    }).compile();

    controller = moduleRef.get(VisualEffectsStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
