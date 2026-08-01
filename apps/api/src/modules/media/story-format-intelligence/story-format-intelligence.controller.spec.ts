import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  StoryFormatIntelligenceController,
} from './story-format-intelligence.controller';

import {
  StoryFormatIntelligenceService,
} from './story-format-intelligence.service';

describe('StoryFormatIntelligenceController', () => {
  let controller: StoryFormatIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          StoryFormatIntelligenceController,
        ],
        providers: [
          StoryFormatIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<StoryFormatIntelligenceController>(
        StoryFormatIntelligenceController,
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
