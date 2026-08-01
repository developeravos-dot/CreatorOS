import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LearningReinvestmentStageController,
} from './learning-reinvestment-stage.controller';

import {
  LearningReinvestmentStageService,
} from './learning-reinvestment-stage.service';

describe('LearningReinvestmentStageController', () => {
  let controller: LearningReinvestmentStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          LearningReinvestmentStageController,
        ],
        providers: [
          LearningReinvestmentStageService,
        ],
      }).compile();

    controller =
      module.get<LearningReinvestmentStageController>(
        LearningReinvestmentStageController,
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
