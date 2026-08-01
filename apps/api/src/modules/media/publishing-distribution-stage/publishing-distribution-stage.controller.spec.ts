import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PublishingDistributionStageController,
} from './publishing-distribution-stage.controller';

import {
  PublishingDistributionStageService,
} from './publishing-distribution-stage.service';

describe('PublishingDistributionStageController', () => {
  let controller: PublishingDistributionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PublishingDistributionStageController,
        ],
        providers: [
          PublishingDistributionStageService,
        ],
      }).compile();

    controller =
      module.get<PublishingDistributionStageController>(
        PublishingDistributionStageController,
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
