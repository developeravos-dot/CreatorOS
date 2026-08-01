import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  SponsorshipIntelligenceEngineController,
} from './sponsorship-intelligence-engine.controller';

import {
  SponsorshipIntelligenceEngineService,
} from './sponsorship-intelligence-engine.service';

describe('SponsorshipIntelligenceEngineController', () => {
  let controller: SponsorshipIntelligenceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          SponsorshipIntelligenceEngineController,
        ],
        providers: [
          SponsorshipIntelligenceEngineService,
        ],
      }).compile();

    controller =
      module.get<SponsorshipIntelligenceEngineController>(
        SponsorshipIntelligenceEngineController,
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
