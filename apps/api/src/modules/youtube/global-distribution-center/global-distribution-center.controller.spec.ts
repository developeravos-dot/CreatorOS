import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  GlobalDistributionCenterController,
} from './global-distribution-center.controller';

import {
  GlobalDistributionCenterService,
} from './global-distribution-center.service';

describe('GlobalDistributionCenterController', () => {
  let controller: GlobalDistributionCenterController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [GlobalDistributionCenterController],
        providers: [GlobalDistributionCenterService],
      }).compile();

    controller =
      module.get<GlobalDistributionCenterController>(
        GlobalDistributionCenterController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
