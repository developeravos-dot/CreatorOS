import { Test, TestingModule } from '@nestjs/testing';
import { CreativeExperimentationStageController } from './creative-experimentation-stage.controller';
import { CreativeExperimentationStageService } from './creative-experimentation-stage.service';

describe('CreativeExperimentationStageController', () => {
  let controller: CreativeExperimentationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreativeExperimentationStageController], providers: [CreativeExperimentationStageService] }).compile();
    controller = module.get(CreativeExperimentationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
