import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  GrowthIntelligenceController,
} from './growth-intelligence.controller';

import {
  GrowthIntelligenceService,
} from './growth-intelligence.service';

describe('GrowthIntelligenceController', () => {
  let controller: GrowthIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [GrowthIntelligenceController],
        providers: [GrowthIntelligenceService],
      }).compile();

    controller =
      module.get<GrowthIntelligenceController>(
        GrowthIntelligenceController,
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

  it('should create a record', () => {
    const record = controller.createRecord({
      title: 'Controller Record',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
