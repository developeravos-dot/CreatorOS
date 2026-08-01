import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CulturalAdaptationStageController,
} from './cultural-adaptation-stage.controller';

import {
  CulturalAdaptationStageService,
} from './cultural-adaptation-stage.service';

describe('CulturalAdaptationStageController', () => {
  let controller: CulturalAdaptationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          CulturalAdaptationStageController,
        ],
        providers: [
          CulturalAdaptationStageService,
        ],
      }).compile();

    controller =
      module.get<CulturalAdaptationStageController>(
        CulturalAdaptationStageController,
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
