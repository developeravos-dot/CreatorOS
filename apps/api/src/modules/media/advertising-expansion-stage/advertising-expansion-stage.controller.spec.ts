import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AdvertisingExpansionStageController,
} from './advertising-expansion-stage.controller';

import {
  AdvertisingExpansionStageService,
} from './advertising-expansion-stage.service';

describe('AdvertisingExpansionStageController', () => {
  let controller: AdvertisingExpansionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AdvertisingExpansionStageController,
        ],
        providers: [
          AdvertisingExpansionStageService,
        ],
      }).compile();

    controller =
      module.get<AdvertisingExpansionStageController>(
        AdvertisingExpansionStageController,
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
