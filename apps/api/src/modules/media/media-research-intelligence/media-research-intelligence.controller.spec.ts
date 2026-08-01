import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaResearchIntelligenceController,
} from './media-research-intelligence.controller';

import {
  MediaResearchIntelligenceService,
} from './media-research-intelligence.service';

describe('MediaResearchIntelligenceController', () => {
  let controller: MediaResearchIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MediaResearchIntelligenceController,
        ],
        providers: [
          MediaResearchIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<MediaResearchIntelligenceController>(
        MediaResearchIntelligenceController,
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
