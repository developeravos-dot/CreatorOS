import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LicensingFranchiseExpansionStageController,
} from './licensing-franchise-expansion-stage.controller';

import {
  LicensingFranchiseExpansionStageService,
} from './licensing-franchise-expansion-stage.service';

describe('LicensingFranchiseExpansionStageController', () => {
  let controller: LicensingFranchiseExpansionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          LicensingFranchiseExpansionStageController,
        ],
        providers: [
          LicensingFranchiseExpansionStageService,
        ],
      }).compile();

    controller =
      module.get<LicensingFranchiseExpansionStageController>(
        LicensingFranchiseExpansionStageController,
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
