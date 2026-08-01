import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContinuousLearningStageController,
} from './continuous-learning-stage.controller';

import {
  ContinuousLearningStageService,
} from './continuous-learning-stage.service';

describe('ContinuousLearningStageController', () => {
  let controller: ContinuousLearningStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ContinuousLearningStageController,
        ],
        providers: [
          ContinuousLearningStageService,
        ],
      }).compile();

    controller =
      module.get<ContinuousLearningStageController>(
        ContinuousLearningStageController,
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
