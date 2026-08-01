import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ProtectableIdeaExtractionStageController,
} from './protectable-idea-extraction-stage.controller';

import {
  ProtectableIdeaExtractionStageService,
} from './protectable-idea-extraction-stage.service';

describe('ProtectableIdeaExtractionStageController', () => {
  let controller: ProtectableIdeaExtractionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ProtectableIdeaExtractionStageController,
        ],
        providers: [
          ProtectableIdeaExtractionStageService,
        ],
      }).useMocker(() => ({})).compile();

    controller =
      module.get<ProtectableIdeaExtractionStageController>(
        ProtectableIdeaExtractionStageController,
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

