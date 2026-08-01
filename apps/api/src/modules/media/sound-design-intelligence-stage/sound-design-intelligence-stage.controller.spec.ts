import { Test, TestingModule } from '@nestjs/testing';
import { SoundDesignIntelligenceStageController } from './sound-design-intelligence-stage.controller';
import { SoundDesignIntelligenceStageService } from './sound-design-intelligence-stage.service';

describe('SoundDesignIntelligenceStageController', () => {
  let controller: SoundDesignIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [SoundDesignIntelligenceStageController], providers: [SoundDesignIntelligenceStageService] }).compile();
    controller = module.get(SoundDesignIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
