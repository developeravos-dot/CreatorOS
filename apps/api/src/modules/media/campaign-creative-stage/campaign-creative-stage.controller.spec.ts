import { Test } from '@nestjs/testing';
import { CampaignCreativeStageController } from './campaign-creative-stage.controller';
import { CampaignCreativeStageService } from './campaign-creative-stage.service';

describe('CampaignCreativeStageController', () => {
  let controller: CampaignCreativeStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CampaignCreativeStageController],
      providers: [CampaignCreativeStageService],
    }).compile();

    controller = moduleRef.get(CampaignCreativeStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
