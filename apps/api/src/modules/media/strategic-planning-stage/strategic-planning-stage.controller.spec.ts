import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  StrategicPlanningStageController,
} from './strategic-planning-stage.controller';

import {
  StrategicPlanningStageService,
} from './strategic-planning-stage.service';

describe('StrategicPlanningStageController', () => {
  let controller: StrategicPlanningStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          StrategicPlanningStageController,
        ],
        providers: [
          StrategicPlanningStageService,
        ],
      }).compile();

    controller =
      module.get<StrategicPlanningStageController>(
        StrategicPlanningStageController,
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
