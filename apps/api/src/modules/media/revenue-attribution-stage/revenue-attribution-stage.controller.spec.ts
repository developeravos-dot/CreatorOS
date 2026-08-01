import { Test } from '@nestjs/testing';
import { RevenueAttributionStageController } from './revenue-attribution-stage.controller';
import { RevenueAttributionStageService } from './revenue-attribution-stage.service';

describe('RevenueAttributionStageController', () => {
  let controller: RevenueAttributionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RevenueAttributionStageController],
      providers: [RevenueAttributionStageService],
    }).compile();

    controller = moduleRef.get(RevenueAttributionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
