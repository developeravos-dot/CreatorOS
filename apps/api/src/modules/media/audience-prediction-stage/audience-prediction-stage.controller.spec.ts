import { Test } from '@nestjs/testing';
import { AudiencePredictionStageController } from './audience-prediction-stage.controller';
import { AudiencePredictionStageService } from './audience-prediction-stage.service';

describe('AudiencePredictionStageController', () => {
  let controller: AudiencePredictionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AudiencePredictionStageController],
      providers: [AudiencePredictionStageService],
    }).compile();

    controller = moduleRef.get(AudiencePredictionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
