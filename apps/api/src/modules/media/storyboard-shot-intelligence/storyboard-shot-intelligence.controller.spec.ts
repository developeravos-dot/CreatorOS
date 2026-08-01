import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  StoryboardShotIntelligenceController,
} from './storyboard-shot-intelligence.controller';

import {
  StoryboardShotIntelligenceService,
} from './storyboard-shot-intelligence.service';

describe('StoryboardShotIntelligenceController', () => {
  let controller: StoryboardShotIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          StoryboardShotIntelligenceController,
        ],
        providers: [
          StoryboardShotIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<StoryboardShotIntelligenceController>(
        StoryboardShotIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
