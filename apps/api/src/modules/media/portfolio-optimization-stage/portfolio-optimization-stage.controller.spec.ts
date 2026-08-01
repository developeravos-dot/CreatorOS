import { Test } from '@nestjs/testing';
import { PortfolioOptimizationStageController } from './portfolio-optimization-stage.controller';
import { PortfolioOptimizationStageService } from './portfolio-optimization-stage.service';

describe('PortfolioOptimizationStageController', () => {
  let controller: PortfolioOptimizationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PortfolioOptimizationStageController],
      providers: [PortfolioOptimizationStageService],
    }).compile();

    controller = moduleRef.get(PortfolioOptimizationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
