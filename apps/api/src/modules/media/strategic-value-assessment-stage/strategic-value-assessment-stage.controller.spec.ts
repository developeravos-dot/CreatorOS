import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  StrategicValueAssessmentStageController,
} from './strategic-value-assessment-stage.controller';

import {
  StrategicValueAssessmentStageService,
} from './strategic-value-assessment-stage.service';

describe('StrategicValueAssessmentStageController', () => {
  let controller: StrategicValueAssessmentStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          StrategicValueAssessmentStageController,
        ],
        providers: [
          StrategicValueAssessmentStageService,
        ],
      }).compile();

    controller =
      module.get<StrategicValueAssessmentStageController>(
        StrategicValueAssessmentStageController,
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
