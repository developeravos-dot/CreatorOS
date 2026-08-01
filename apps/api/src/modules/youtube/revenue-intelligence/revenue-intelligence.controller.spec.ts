import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RevenueIntelligenceController,
} from './revenue-intelligence.controller';

import {
  RevenueIntelligenceService,
} from './revenue-intelligence.service';

describe('RevenueIntelligenceController', () => {
  let controller: RevenueIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [RevenueIntelligenceController],
        providers: [RevenueIntelligenceService],
      }).compile();

    controller =
      module.get<RevenueIntelligenceController>(
        RevenueIntelligenceController,
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

  it('should create a monetization record', () => {
    const record = controller.createRecord({
      title: 'Controller Revenue',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
