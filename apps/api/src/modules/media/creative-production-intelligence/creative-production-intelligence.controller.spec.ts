import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CreativeProductionIntelligenceController,
} from './creative-production-intelligence.controller';

import {
  CreativeProductionIntelligenceService,
} from './creative-production-intelligence.service';

describe('CreativeProductionIntelligenceController', () => {
  let controller: CreativeProductionIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          CreativeProductionIntelligenceController,
        ],
        providers: [
          CreativeProductionIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<CreativeProductionIntelligenceController>(
        CreativeProductionIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
