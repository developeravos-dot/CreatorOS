import { Test } from '@nestjs/testing';
import { CrossPromotionStageController } from './cross-promotion-stage.controller';
import { CrossPromotionStageService } from './cross-promotion-stage.service';

describe('CrossPromotionStageController', () => {
  let controller: CrossPromotionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CrossPromotionStageController],
      providers: [CrossPromotionStageService],
    }).compile();

    controller = moduleRef.get(CrossPromotionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
