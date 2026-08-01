import { Test } from '@nestjs/testing';
import { StoryWorldBuildingStageController } from './story-world-building-stage.controller';
import { StoryWorldBuildingStageService } from './story-world-building-stage.service';

describe('StoryWorldBuildingStageController', () => {
  let controller: StoryWorldBuildingStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StoryWorldBuildingStageController],
      providers: [StoryWorldBuildingStageService],
    }).compile();

    controller = moduleRef.get(StoryWorldBuildingStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
