import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PartnershipIntelligenceController,
} from './partnership-intelligence.controller';

import {
  PartnershipIntelligenceService,
} from './partnership-intelligence.service';

describe('PartnershipIntelligenceController', () => {
  let controller: PartnershipIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PartnershipIntelligenceController],
        providers: [PartnershipIntelligenceService],
      }).compile();

    controller =
      module.get<PartnershipIntelligenceController>(
        PartnershipIntelligenceController,
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

  it('should create a brand or IP record', () => {
    const record = controller.createRecord({
      name: 'Controller IP',
      category: 'controller',
      owner: 'CreatorOS',
    });

    expect(record.id).toBeDefined();
  });
});
