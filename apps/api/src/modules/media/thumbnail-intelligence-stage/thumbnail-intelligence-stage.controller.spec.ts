import { Test } from '@nestjs/testing';
import { ThumbnailIntelligenceStageController } from './thumbnail-intelligence-stage.controller';
import { ThumbnailIntelligenceStageService } from './thumbnail-intelligence-stage.service';

describe('ThumbnailIntelligenceStageController', () => {
  let controller: ThumbnailIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ThumbnailIntelligenceStageController],
      providers: [ThumbnailIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(ThumbnailIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
