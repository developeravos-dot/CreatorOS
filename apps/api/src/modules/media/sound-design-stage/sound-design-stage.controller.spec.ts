import { Test } from '@nestjs/testing';
import { SoundDesignStageController } from './sound-design-stage.controller';
import { SoundDesignStageService } from './sound-design-stage.service';

describe('SoundDesignStageController', () => {
  let controller: SoundDesignStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SoundDesignStageController],
      providers: [SoundDesignStageService],
    }).compile();

    controller = moduleRef.get(SoundDesignStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
