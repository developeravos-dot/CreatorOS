import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CompetitorIntelligenceController,
} from './competitor-intelligence.controller';

import {
  CompetitorIntelligenceService,
} from './competitor-intelligence.service';

describe('CompetitorIntelligenceController', () => {
  let controller: CompetitorIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CompetitorIntelligenceController],
        providers: [CompetitorIntelligenceService],
      }).compile();

    controller =
      module.get<CompetitorIntelligenceController>(
        CompetitorIntelligenceController,
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
      title: 'Controller Operation',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
