import { Test } from '@nestjs/testing';
import { PaceOptimizationStageController } from './pace-optimization-stage.controller';
import { PaceOptimizationStageService } from './pace-optimization-stage.service';

describe('PaceOptimizationStageController', () => {
  let controller: PaceOptimizationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PaceOptimizationStageController],
      providers: [PaceOptimizationStageService],
    }).compile();

    controller = moduleRef.get(PaceOptimizationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
