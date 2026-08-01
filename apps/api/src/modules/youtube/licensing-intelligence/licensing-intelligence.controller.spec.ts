import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LicensingIntelligenceController,
} from './licensing-intelligence.controller';

import {
  LicensingIntelligenceService,
} from './licensing-intelligence.service';

describe('LicensingIntelligenceController', () => {
  let controller: LicensingIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [LicensingIntelligenceController],
        providers: [LicensingIntelligenceService],
      }).compile();

    controller =
      module.get<LicensingIntelligenceController>(
        LicensingIntelligenceController,
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
