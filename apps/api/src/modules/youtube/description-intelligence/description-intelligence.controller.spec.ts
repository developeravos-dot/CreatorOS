import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  DescriptionIntelligenceController,
} from './description-intelligence.controller';

import {
  DescriptionIntelligenceService,
} from './description-intelligence.service';

describe('DescriptionIntelligenceController', () => {
  let controller: DescriptionIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [DescriptionIntelligenceController],
        providers: [DescriptionIntelligenceService],
      }).compile();

    controller =
      module.get<DescriptionIntelligenceController>(
        DescriptionIntelligenceController,
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
