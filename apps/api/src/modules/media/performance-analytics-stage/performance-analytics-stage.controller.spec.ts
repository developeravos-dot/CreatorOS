import { Test } from '@nestjs/testing';
import { PerformanceAnalyticsStageController } from './performance-analytics-stage.controller';
import { PerformanceAnalyticsStageService } from './performance-analytics-stage.service';

describe('PerformanceAnalyticsStageController', () => {
  let controller: PerformanceAnalyticsStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PerformanceAnalyticsStageController],
      providers: [PerformanceAnalyticsStageService],
    }).compile();

    controller = moduleRef.get(PerformanceAnalyticsStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
