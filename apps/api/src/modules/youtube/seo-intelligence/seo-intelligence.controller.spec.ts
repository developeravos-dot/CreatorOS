import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  SeoIntelligenceController,
} from './seo-intelligence.controller';

import {
  SeoIntelligenceService,
} from './seo-intelligence.service';

describe('SeoIntelligenceController', () => {
  let controller: SeoIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [SeoIntelligenceController],
        providers: [SeoIntelligenceService],
      }).compile();

    controller =
      module.get<SeoIntelligenceController>(
        SeoIntelligenceController,
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
});
