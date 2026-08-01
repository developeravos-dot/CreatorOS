import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TagsIntelligenceController,
} from './tags-intelligence.controller';

import {
  TagsIntelligenceService,
} from './tags-intelligence.service';

describe('TagsIntelligenceController', () => {
  let controller: TagsIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [TagsIntelligenceController],
        providers: [TagsIntelligenceService],
      }).compile();

    controller =
      module.get<TagsIntelligenceController>(
        TagsIntelligenceController,
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
