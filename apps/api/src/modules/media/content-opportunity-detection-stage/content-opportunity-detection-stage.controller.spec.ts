import { Test } from '@nestjs/testing';
import { ContentOpportunityDetectionStageController } from './content-opportunity-detection-stage.controller';
import { ContentOpportunityDetectionStageService } from './content-opportunity-detection-stage.service';

describe('ContentOpportunityDetectionStageController', () => {
  let controller: ContentOpportunityDetectionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ContentOpportunityDetectionStageController],
      providers: [ContentOpportunityDetectionStageService],
    }).compile();

    controller = moduleRef.get(ContentOpportunityDetectionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
