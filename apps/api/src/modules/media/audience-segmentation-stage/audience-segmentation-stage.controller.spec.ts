import { Test } from '@nestjs/testing';
import { AudienceSegmentationStageController } from './audience-segmentation-stage.controller';
import { AudienceSegmentationStageService } from './audience-segmentation-stage.service';

describe('AudienceSegmentationStageController', () => {
  let controller: AudienceSegmentationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AudienceSegmentationStageController],
      providers: [AudienceSegmentationStageService],
    }).compile();

    controller = moduleRef.get(AudienceSegmentationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
