import { Test } from '@nestjs/testing';
import { EngagementOptimizationStageController } from './engagement-optimization-stage.controller';
import { EngagementOptimizationStageService } from './engagement-optimization-stage.service';

describe('EngagementOptimizationStageController', () => {
  let controller: EngagementOptimizationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EngagementOptimizationStageController],
      providers: [EngagementOptimizationStageService],
    }).compile();

    controller = moduleRef.get(EngagementOptimizationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
