import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MultiPlatformDistributionStageController,
} from './multi-platform-distribution-stage.controller';

import {
  MultiPlatformDistributionStageService,
} from './multi-platform-distribution-stage.service';

describe('MultiPlatformDistributionStageController', () => {
  let controller: MultiPlatformDistributionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MultiPlatformDistributionStageController,
        ],
        providers: [
          MultiPlatformDistributionStageService,
        ],
      }).compile();

    controller =
      module.get<MultiPlatformDistributionStageController>(
        MultiPlatformDistributionStageController,
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
