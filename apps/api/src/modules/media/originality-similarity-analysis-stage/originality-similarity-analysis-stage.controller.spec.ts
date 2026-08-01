import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  OriginalitySimilarityAnalysisStageController,
} from './originality-similarity-analysis-stage.controller';

import {
  OriginalitySimilarityAnalysisStageService,
} from './originality-similarity-analysis-stage.service';

describe('OriginalitySimilarityAnalysisStageController', () => {
  let controller: OriginalitySimilarityAnalysisStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          OriginalitySimilarityAnalysisStageController,
        ],
        providers: [
          OriginalitySimilarityAnalysisStageService,
        ],
      }).compile();

    controller =
      module.get<OriginalitySimilarityAnalysisStageController>(
        OriginalitySimilarityAnalysisStageController,
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
