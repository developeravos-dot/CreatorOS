import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  InfringementMonitoringStageController,
} from './infringement-monitoring-stage.controller';

import {
  InfringementMonitoringStageService,
} from './infringement-monitoring-stage.service';

describe('InfringementMonitoringStageController', () => {
  let controller: InfringementMonitoringStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          InfringementMonitoringStageController,
        ],
        providers: [
          InfringementMonitoringStageService,
        ],
      }).compile();

    controller =
      module.get<InfringementMonitoringStageController>(
        InfringementMonitoringStageController,
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
