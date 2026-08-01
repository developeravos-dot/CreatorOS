import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ThumbnailIntelligenceController,
} from './thumbnail-intelligence.controller';

import {
  ThumbnailIntelligenceService,
} from './thumbnail-intelligence.service';

describe('ThumbnailIntelligenceController', () => {
  let controller: ThumbnailIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ThumbnailIntelligenceController],
        providers: [ThumbnailIntelligenceService],
      }).compile();

    controller =
      module.get<ThumbnailIntelligenceController>(
        ThumbnailIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should return optimization rules', () => {
    const rules = controller.getRules();

    expect(rules.maximumLength).toBeGreaterThan(
      rules.minimumLength,
    );
  });
});
