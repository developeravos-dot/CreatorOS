import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ConceptDevelopmentStageController,
} from './concept-development-stage.controller';

import {
  ConceptDevelopmentStageService,
} from './concept-development-stage.service';

describe('ConceptDevelopmentStageController', () => {
  let controller: ConceptDevelopmentStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ConceptDevelopmentStageController,
        ],
        providers: [
          ConceptDevelopmentStageService,
        ],
      }).compile();

    controller =
      module.get<ConceptDevelopmentStageController>(
        ConceptDevelopmentStageController,
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
