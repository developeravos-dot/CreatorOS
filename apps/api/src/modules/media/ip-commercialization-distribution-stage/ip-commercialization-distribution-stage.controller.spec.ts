import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpCommercializationDistributionStageController,
} from './ip-commercialization-distribution-stage.controller';

import {
  IpCommercializationDistributionStageService,
} from './ip-commercialization-distribution-stage.service';

describe('IpCommercializationDistributionStageController', () => {
  let controller: IpCommercializationDistributionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpCommercializationDistributionStageController,
        ],
        providers: [
          IpCommercializationDistributionStageService,
        ],
      }).compile();

    controller =
      module.get<IpCommercializationDistributionStageController>(
        IpCommercializationDistributionStageController,
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
