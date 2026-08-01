import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PartnerCreatorNetworkStageController,
} from './partner-creator-network-stage.controller';

import {
  PartnerCreatorNetworkStageService,
} from './partner-creator-network-stage.service';

describe('PartnerCreatorNetworkStageController', () => {
  let controller: PartnerCreatorNetworkStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PartnerCreatorNetworkStageController,
        ],
        providers: [
          PartnerCreatorNetworkStageService,
        ],
      }).compile();

    controller =
      module.get<PartnerCreatorNetworkStageController>(
        PartnerCreatorNetworkStageController,
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
