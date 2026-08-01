import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LocalizationGlobalDistributionController,
} from './localization-global-distribution.controller';

import {
  LocalizationGlobalDistributionService,
} from './localization-global-distribution.service';

describe('LocalizationGlobalDistributionController', () => {
  let controller: LocalizationGlobalDistributionController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          LocalizationGlobalDistributionController,
        ],
        providers: [
          LocalizationGlobalDistributionService,
        ],
      }).compile();

    controller =
      module.get<LocalizationGlobalDistributionController>(
        LocalizationGlobalDistributionController,
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
