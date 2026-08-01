import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentLicensingRevenueEngineController,
} from './content-licensing-revenue-engine.controller';

import {
  ContentLicensingRevenueEngineService,
} from './content-licensing-revenue-engine.service';

describe('ContentLicensingRevenueEngineController', () => {
  let controller: ContentLicensingRevenueEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ContentLicensingRevenueEngineController,
        ],
        providers: [
          ContentLicensingRevenueEngineService,
        ],
      }).compile();

    controller =
      module.get<ContentLicensingRevenueEngineController>(
        ContentLicensingRevenueEngineController,
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
