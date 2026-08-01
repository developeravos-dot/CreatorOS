import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ResearchValidationStageController,
} from './research-validation-stage.controller';

import {
  ResearchValidationStageService,
} from './research-validation-stage.service';

describe('ResearchValidationStageController', () => {
  let controller: ResearchValidationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ResearchValidationStageController,
        ],
        providers: [
          ResearchValidationStageService,
        ],
      }).compile();

    controller =
      module.get<ResearchValidationStageController>(
        ResearchValidationStageController,
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
