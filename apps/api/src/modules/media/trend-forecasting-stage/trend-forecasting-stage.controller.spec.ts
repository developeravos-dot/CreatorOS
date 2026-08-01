import { Test } from '@nestjs/testing';
import { TrendForecastingStageController } from './trend-forecasting-stage.controller';
import { TrendForecastingStageService } from './trend-forecasting-stage.service';

describe('TrendForecastingStageController', () => {
  let controller: TrendForecastingStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TrendForecastingStageController],
      providers: [TrendForecastingStageService],
    }).compile();

    controller = moduleRef.get(TrendForecastingStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
