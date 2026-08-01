import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AudienceIntelligenceEngineController,
} from './audience-intelligence-engine.controller';

import {
  AudienceIntelligenceEngineService,
} from './audience-intelligence-engine.service';

describe('AudienceIntelligenceEngineController', () => {
  let controller: AudienceIntelligenceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AudienceIntelligenceEngineController,
        ],
        providers: [
          AudienceIntelligenceEngineService,
        ],
      }).compile();

    controller =
      module.get<AudienceIntelligenceEngineController>(
        AudienceIntelligenceEngineController,
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
