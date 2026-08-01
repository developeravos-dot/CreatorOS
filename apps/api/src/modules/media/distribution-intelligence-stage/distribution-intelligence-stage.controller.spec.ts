import { Test } from '@nestjs/testing';
import { DistributionIntelligenceStageController } from './distribution-intelligence-stage.controller';
import { DistributionIntelligenceStageService } from './distribution-intelligence-stage.service';

describe('DistributionIntelligenceStageController', () => {
  let controller: DistributionIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DistributionIntelligenceStageController],
      providers: [DistributionIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(DistributionIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
