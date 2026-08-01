import { Test } from '@nestjs/testing';
import { StoryboardIntelligenceStageController } from './storyboard-intelligence-stage.controller';
import { StoryboardIntelligenceStageService } from './storyboard-intelligence-stage.service';

describe('StoryboardIntelligenceStageController', () => {
  let controller: StoryboardIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StoryboardIntelligenceStageController],
      providers: [StoryboardIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(StoryboardIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
