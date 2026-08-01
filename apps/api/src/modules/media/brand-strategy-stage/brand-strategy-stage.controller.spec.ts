import { Test } from '@nestjs/testing';
import { BrandStrategyStageController } from './brand-strategy-stage.controller';
import { BrandStrategyStageService } from './brand-strategy-stage.service';

describe('BrandStrategyStageController', () => {
  let controller: BrandStrategyStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BrandStrategyStageController],
      providers: [BrandStrategyStageService],
    }).compile();

    controller = moduleRef.get(BrandStrategyStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
