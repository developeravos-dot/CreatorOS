import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LocalAudienceIntelligenceStageController,
} from './local-audience-intelligence-stage.controller';

import {
  LocalAudienceIntelligenceStageService,
} from './local-audience-intelligence-stage.service';

describe('LocalAudienceIntelligenceStageController', () => {
  let controller: LocalAudienceIntelligenceStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          LocalAudienceIntelligenceStageController,
        ],
        providers: [
          LocalAudienceIntelligenceStageService,
        ],
      }).compile();

    controller =
      module.get<LocalAudienceIntelligenceStageController>(
        LocalAudienceIntelligenceStageController,
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
