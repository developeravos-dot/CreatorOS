import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AdvertisingRevenueEngineController,
} from './advertising-revenue-engine.controller';

import {
  AdvertisingRevenueEngineService,
} from './advertising-revenue-engine.service';

describe('AdvertisingRevenueEngineController', () => {
  let controller: AdvertisingRevenueEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AdvertisingRevenueEngineController,
        ],
        providers: [
          AdvertisingRevenueEngineService,
        ],
      }).compile();

    controller =
      module.get<AdvertisingRevenueEngineController>(
        AdvertisingRevenueEngineController,
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
