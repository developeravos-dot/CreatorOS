import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PublishingIntelligenceController,
} from './publishing-intelligence.controller';

import {
  PublishingIntelligenceService,
} from './publishing-intelligence.service';

describe('PublishingIntelligenceController', () => {
  let controller: PublishingIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PublishingIntelligenceController],
        providers: [PublishingIntelligenceService],
      }).compile();

    controller =
      module.get<PublishingIntelligenceController>(
        PublishingIntelligenceController,
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
