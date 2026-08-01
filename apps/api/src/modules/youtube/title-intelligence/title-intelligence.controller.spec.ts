import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TitleIntelligenceController,
} from './title-intelligence.controller';

import {
  TitleIntelligenceService,
} from './title-intelligence.service';

describe('TitleIntelligenceController', () => {
  let controller: TitleIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [TitleIntelligenceController],
        providers: [TitleIntelligenceService],
      }).compile();

    controller =
      module.get<TitleIntelligenceController>(
        TitleIntelligenceController,
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
