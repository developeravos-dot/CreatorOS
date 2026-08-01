import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpAssetDiscoveryStageController,
} from './ip-asset-discovery-stage.controller';

import {
  IpAssetDiscoveryStageService,
} from './ip-asset-discovery-stage.service';

describe('IpAssetDiscoveryStageController', () => {
  let controller: IpAssetDiscoveryStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpAssetDiscoveryStageController,
        ],
        providers: [
          IpAssetDiscoveryStageService,
        ],
      }).compile();

    controller =
      module.get<IpAssetDiscoveryStageController>(
        IpAssetDiscoveryStageController,
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

  it('should expose 24-stage blueprint', () => {
    expect(
      controller.getBlueprint().stages,
    ).toHaveLength(24);
  });
});
