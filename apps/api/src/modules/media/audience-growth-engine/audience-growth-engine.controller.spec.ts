import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AudienceGrowthEngineController,
} from './audience-growth-engine.controller';

import {
  AudienceGrowthEngineService,
} from './audience-growth-engine.service';

describe('AudienceGrowthEngineController', () => {
  let controller: AudienceGrowthEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AudienceGrowthEngineController,
        ],
        providers: [
          AudienceGrowthEngineService,
        ],
      }).compile();

    controller =
      module.get<AudienceGrowthEngineController>(
        AudienceGrowthEngineController,
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
