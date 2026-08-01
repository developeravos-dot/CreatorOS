import { Test } from '@nestjs/testing';
import { GrowthExperimentationStageController } from './growth-experimentation-stage.controller';
import { GrowthExperimentationStageService } from './growth-experimentation-stage.service';

describe('GrowthExperimentationStageController', () => {
  let controller: GrowthExperimentationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GrowthExperimentationStageController],
      providers: [GrowthExperimentationStageService],
    }).compile();

    controller = moduleRef.get(GrowthExperimentationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
